const mongoose = require('mongoose');
const querystring = require('querystring');

const { Schema } = mongoose;

const VideoSchema = new Schema({
  title: String,
  iframe_url: String,
  genre: String,
}, { timestamps: true });

VideoSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    title: this.title,
    iframe_url: querystring.unescape(this.iframe_url),
    genre: this.genre,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

mongoose.model('Videos', VideoSchema);