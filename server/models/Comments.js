const mongoose = require('mongoose');
const querystring = require('querystring');

const { Schema } = mongoose;

const CommentsSchema = new Schema({
	userId: String,
	videoId: String,
	commentString: String
}, { timestamps: true });

CommentsSchema.methods.toJSON = function() {
  return {
		userId: this.userId,
		videoId: this.videoId,
		commentString: this.commentString,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

mongoose.model('Comments', CommentsSchema);