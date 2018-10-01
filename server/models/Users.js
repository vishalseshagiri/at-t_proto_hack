const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: String,
  hash: String,
  salt: String,
	badges: {
		"comedy": Number,
		"talk-shows": Number,
		"thrillers": Number,
		"drama": Number,
		"sports": Number
	},
	watching: String,
	watched: [String],
	friends : [String]
});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

// UsersSchema.methods.addToWatched = function() {

// }

UsersSchema.methods.toAuthJSON = function(video_id = "", genre_name = "") {
	this.watching = video_id;
	if(video_id) {
		if (this.watched.indexOf(this.watching) == -1) {
			this.watched.unshift(this.watching);
		} else {
			this.watched.splice(this.watched.indexOf(this.watching), 1)
			this.watched.unshift(this.watching)
		}
	}
	if(genre_name){
		this.badges[genre_name] += 1;
	}
	
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
		watching: this.watching,
		watched: this.watched,
		badges: this.badges,
		friends : this.friends
  };
};

mongoose.model('Users', UsersSchema);