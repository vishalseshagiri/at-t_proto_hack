from PyQt5 import QtCore, QtGui, QtWidgets
import recommend
import pickle

class Ui_Dialog(object):
    def setupUi(self, Dialog):
        Dialog.setObjectName("Recommendation System")
        Dialog.resize(401, 373)
        #Dialog.setWindowTitle("Recommendation System")
        self.pushButton = QtWidgets.QPushButton(Dialog)
        self.pushButton.setGeometry(QtCore.QRect(120, 150, 112, 34))
        self.pushButton.setObjectName("pushButton")
        self.label = QtWidgets.QLabel(Dialog)
        self.label.setGeometry(QtCore.QRect(70, 90, 111, 31))
        self.label.setObjectName("label")
        self.textEdit = QtWidgets.QTextEdit(Dialog)
        self.textEdit.setGeometry(QtCore.QRect(200, 90, 101, 31))
        self.textEdit.setObjectName("textEdit")
        self.textBrowser = QtWidgets.QTextBrowser(Dialog)
        self.textBrowser.setGeometry(QtCore.QRect(65, 210, 241, 101))
        self.textBrowser.setObjectName("textBrowser")
        self.label_2 = QtWidgets.QLabel(Dialog)
        self.label_2.setGeometry(QtCore.QRect(80, 40, 191, 21))
        self.label_2.setAutoFillBackground(False)
        self.label_2.setObjectName("label_2")

        self.pushButton.clicked.connect(self.on_click)
        #self.show()
        
        self.retranslateUi(Dialog)
        QtCore.QMetaObject.connectSlotsByName(Dialog)

    def retranslateUi(self, Dialog):
        _translate = QtCore.QCoreApplication.translate
        Dialog.setWindowTitle(_translate("Dialog", "Dialog"))
        self.pushButton.setText(_translate("Dialog", "Recommend"))
        self.label.setText(_translate("Dialog", "Enter User ID:"))
        self.label_2.setText(_translate("Dialog", "Recommendation System"))

    def on_click(self):
        tuser = self.textEdit.toPlainText()
        genre = pickle.load( open( "genre.pickle", "rb" ) )
        cf_pred = pickle.load( open( "cf.pickle", "rb" ) )
        rec = recommend.recommend(int(tuser), cf_pred, genre)
        srec = ""
        first = 0
        for i in rec:
            if(first == 0):
                srec = srec + str(i)
                first = 1
            else:
                srec = srec + ", " + str(i) 
        if(len(srec)>0):
            text = "The movies recommended to user " + tuser + " are: " + srec
        else:
            text = "User not found!"
            
        self.textBrowser.setText(text)
        
if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    Dialog = QtWidgets.QDialog()
    ui = Ui_Dialog()
    ui.setupUi(Dialog)
    Dialog.show()
    sys.exit(app.exec_())