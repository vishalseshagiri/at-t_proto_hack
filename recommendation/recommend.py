import pyspark
from pyspark import SparkContext
import math
import pandas as pd
import random
import pickle
#import sys
#import itertools
#import time
#import numpy as np

# Function for creating a dataset with "no" number of users from the MovieLens small dataset
def select(no):
    df1 = pd.read_csv('ratings.csv')
    df2 = pd.read_csv('movies.csv')
    l1 = [i for i in range(1,no+1)]
    df1 = df1.loc[df1['userId'].isin(l1)]
    df1 = df1.drop('timestamp',axis=1)
    movie_val = df1['movieId'].unique()
    movie_val = list(movie_val)
    movie_val.sort()

    movie_map = {}
    ctr = 1
    for i in movie_val:
        movie_map[i] = ctr
        ctr+=1
        
    for index,rows in df1.iterrows():
        df1.loc[index,'movieId'] = movie_map[int(rows['movieId'])]
    
    user_uniq = df1['userId'].unique()
    movie_uniq = df1['movieId'].unique()
    movie_uniq.sort()
    
    train = []
    for index,rows in df1.iterrows():
        tupl = (int(rows['userId']),int(rows['movieId']))
        train.append(tupl)
        
    genre_dict = {}
    for index,rows in df2.iterrows():
        if(int(rows['movieId']) in movie_map):
            genre_dict[movie_map[int(rows['movieId'])]] = rows['genres'].split('|')
            
    genre_list = []
    for i in genre_dict:
        for genre in genre_dict[i]:
            if(genre in genre_list):
                continue
            else:
                genre_list.append(genre)
                
    df1.to_csv('input.csv',index=False)
    
    test = []
    for user in user_uniq:
        for movie in movie_uniq:
            tup = (user,movie)
            if(tup not in train):
                test.append(tup)
            
    return train, test, genre_dict
    
#Cosine Similarity:
def cosine(vec1,vec2):
    xx = 0
    xy = 0
    yy = 0
    for i in range(len(vec1)):
        x = vec1[i]
        y = vec2[i]
        xx += x*x
        yy += y*y
        xy += x*y
    if(xy != 0):
        return float(xy)/float(math.sqrt(xx*yy))
    else:
        return 0

# Item-based CF
def recommendation(test):
    
    ip = "input.csv"
    sc = SparkContext.getOrCreate()#("local[*]")
    lines = sc.textFile(ip)#.persist(pyspark.StorageLevel.MEMORY_AND_DISK)
    #print(lines.getNumPartitions())
    
    d1 = lines.map(lambda line: line.split(','))
    header = d1.first()
    d2 = d1.filter(lambda line: line != header)
    
    d3 = d2.map(lambda x: (int(x[0]),int(x[1])))
    mat1 = d3.collect()
    d31 = d3.distinct().groupByKey().map(lambda x : x[0]).collect()
    d31.sort()
    
    d4 = d2.map(lambda x: (int(x[1]),int(x[0])))
    d41 = d4.distinct().groupByKey().map(lambda x : x[0]).collect()
    d41.sort()
    
    cmat = [[0 for i in range(len(d41))] for j in range(len(d31))]

    dicty = {}
    t2 = 0
    for i in d41:
        if i not in dicty:
            dicty[i] = t2
            t2+=1
            
    rdicty = {}
    t2 = 0
    for i in d41:
        if t2 not in rdicty:
            rdicty[t2] = i
            t2+=1
            
    for i in mat1:
        cmat[i[0]-1][dicty[i[1]]] = 1
        
    d1 = {}
    for i in mat1:
        if(i not in d1):
            d1[i] = 1
            
    lines2 = sc.parallelize(test).persist(pyspark.StorageLevel.MEMORY_AND_DISK)
    #print(lines2.getNumPartitions())
    td3 = lines2.map(lambda x: (int(x[0]),int(x[1])))
    
    d32 = d2.map(lambda x: (int(x[0]),int(x[1]),float(x[2])))
    new1 = d32.map(lambda x: ((x[0],x[1]),x[2]))
    new2 = td3.map(lambda x: ((x[0],x[1]),1))
    new3 = new1.subtractByKey(new2)
    
    ratings = new3.map(lambda l: (int(l[0][0]), int(l[0][1]), float(l[1])))
    
    d31 = d3.map(lambda x : x[0]).distinct().collect()
    d31.sort()
    
    d4 = d2.map(lambda x: (int(x[1])))
    d41 = d4.distinct().collect()
    d41.sort()
    
    cmats = [[0 for i in range(len(d41))] for j in range(len(d31))]
    
    dicty = {}
    t2 = 0
    for i in d41:
        if i not in dicty:
            dicty[i] = t2
            t2+=1
    
    rdicty = {}
    t2 = 0
    for i in d41:
        if t2 not in rdicty:
            rdicty[t2] = i
            t2+=1
    
    mat1 = ratings.collect()
    
    ndic1 = {}
    for i in mat1:
        key = (i[0],i[1])
        if(key not in ndic1):
            ndic1[key] = i[2]
    
    for i in mat1:
        key =  (i[0],i[1])
        cmats[i[0]-1][dicty[i[1]]] = ndic1[key]
    
    newd3 = ratings.map(lambda x: ((x[0],x[1]),x[2]))
    
    dval = newd3.collect()
    
    valdict = {}
    for item in dval:
        temp = item[0]
        if(temp not in valdict):
            valdict[temp] = item[1]
    
    test_mat = td3.collect()
    
    mat2 = []
    for item in cmats:
        minus = (sum(item))/(len([i for i, e in enumerate(item) if e != 0]))
        mat2.append(list(map(lambda x: x - minus if x>0 else 0, item)))
        
    mat2i = zip(*mat2)
    
    newd3 = ratings.map(lambda x: ((x[0],x[1]),x[2]))
    
    dval = newd3.collect()
    
    valdict = {}
    for item in dval:
        temp = item[0]
        if(temp not in valdict):
            valdict[temp] = item[1]
            
    pred_rating2 = []
    mat4 = []
    for item in test_mat:
        denom = 0
        num = 0
        for tmz in range(len(mat2i)):
            tupp = (item[0],rdicty[tmz])
            if(tupp in valdict):
                mul = cosine(mat2i[tmz],mat2i[dicty[item[1]]])
                denom += mul
                num += mul * valdict[tupp]
        if(num==0 or denom ==0):
            value = 0
        else:
            value = (num/denom)
        if(value<0):
            value = 0
        elif(value>5):
            value=5
        pred_rating2.append(value)
        tempp = (item,value)
        mat4.append(tempp)
        
    mat5 = []
    for i in mat4:
        if(math.isnan(i[1])):
            mat5.append((i[0],0))
        else:
            mat5.append(i)
    
    op1 = sorted(mat5, key = lambda x: (x[0][0], x[0][1]))
    
    return op1

#Function for generating dummy heart rate values for each movie a user has watched based on his ratings
def heart_rate():
    dfhr = pd.read_csv('input.csv')
    dfhr['heart_rate'] = ''
    for index,row in dfhr.iterrows():
        if(row['rating'] > 0 and row['rating'] <=1):
            hr = random.randint(60,80)
            dfhr.loc[index,'heart_rate'] = hr
        elif(row['rating'] > 1 and row['rating'] <=1.5):
            hr = random.randint(81,90)
            dfhr.loc[index,'heart_rate'] = hr
        elif(row['rating'] > 1.5 and row['rating'] <=2):
            hr = random.randint(91,100)
            dfhr.loc[index,'heart_rate'] = hr
        elif(row['rating'] > 2 and row['rating'] <=2.5):
            hr = random.randint(101,110)
            dfhr.loc[index,'heart_rate'] = hr
        elif(row['rating'] > 2 and row['rating'] <=3):
            hr = random.randint(111,120)
            dfhr.loc[index,'heart_rate'] = hr
        elif(row['rating'] > 3 and row['rating'] <= 3.5):
            hr = random.randint(121,130)
            dfhr.loc[index,'heart_rate'] = hr
        elif(row['rating'] > 3.5 and row['rating'] <=4):
            hr = random.randint(131,140)
            dfhr.loc[index,'heart_rate'] = hr
        elif(row['rating'] > 4 and row['rating'] <=4.5):
            hr = random.randint(141,150)
            dfhr.loc[index,'heart_rate'] = hr
        else:
            hr = random.randint(151,160)
            dfhr.loc[index,'heart_rate'] = hr
            
    dfhr.to_csv('rating_hr.csv',index = False)

# Recommend function - to be used in GUI    
def recommend(tuser, predl, genre_dict):
    test_user = tuser
    df3 = pd.read_csv('rating_hr.csv')
    user_genre_dict = {}
    user_hr_dict = {}
    for index,rows in df3.iterrows():
        if(user_genre_dict.has_key(int(rows['userId'])) == False):
            user_hr_dict[int(rows['userId'])] = int(rows['heart_rate'])
            user_genre_dict[int(rows['userId'])] = int(rows['movieId'])
        else:
            if(int(rows['heart_rate']) >  user_hr_dict[int(rows['userId'])]):
                user_hr_dict[int(rows['userId'])] = int(rows['heart_rate'])
                user_genre_dict[int(rows['userId'])] = int(rows['movieId'])
                
    user_g_dict = {}
    for item in user_genre_dict:
        value = user_genre_dict[item]
        user_g_dict[item] = genre_dict[value]
        
    op_list = sorted(predl, key = lambda x: (x[0][0],x[1]), reverse = True)
    test_movie_list = []
    for item in op_list:
        if(item[0][0]<test_user):
            break
        if(item[0][0] == test_user):
            for val1 in genre_dict[item[0][1]]:
                if(val1 in user_g_dict[test_user]):
                    test_movie_list.append(item[0][1])
                    break
    
    dataf = pd.read_csv('movies.csv')
    
    movie_map = {}
    ctr = 1
    movie_val = dataf['movieId'].unique()
    movie_val = list(movie_val)
    movie_val.sort()
    for i in movie_val:
        movie_map[i] = ctr
        ctr+=1
        
    for index,rows in dataf.iterrows():
        dataf.loc[index,'movieId'] = movie_map[int(rows['movieId'])]
        
    title = {}
    for index,rows in dataf.iterrows():
        title[int(rows['movieId'])] = rows['title'].split(' (')[0]
    int_op = test_movie_list[:10]
    recs = []

    for i in int_op:
        recs.append(title[i])

    return recs
        

'''
# Generate all the pickle files to be used in GUI - Train
if __name__ == '__main__':
    print "Recommendation System:"
    tuser = raw_input("Enter user:")
    print "User -", tuser
    
    train, test, genre_dict = select(15)
    
    with open("train.pickle",'wb') as f1:
        pickle.dump(train,f1)
    with open("test.pickle",'wb') as f2:
        pickle.dump(test,f2)
    with open("genre.pickle",'wb') as f3:
        pickle.dump(genre_dict,f3)

    cf_pred = recommendation(test)
    
    with open("cf.pickle",'wb') as f4:
        pickle.dump(cf_pred,f4)
        
    heart_rate()
    print "The movies recommended to user",int(tuser),"are:", recommend(int(tuser), cf_pred, genre_dict)
    
'''

if __name__ == '__main__':
    print "Recommendation System:"
    tuser = raw_input("Enter user(1-15):")
    print "User -", tuser
    
    genre = pickle.load( open( "genre.pickle", "rb" ) )
    cf_pred = pickle.load( open( "cf.pickle", "rb" ) )
    
    rec = recommend(int(tuser), cf_pred, genre)
    
    if(len(rec)>0):
        print "The movies recommended to user",int(tuser),"are:", rec
    else:
        print "User not found." 