const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const Comments = mongoose.model('Comments');
const Users = mongoose.model('Users');

router.get('/', auth.required, (req, res, next) => {
	const { payload: { id }} = req;

  return Users.findById(id, (err, user) => {
    if(err) {
      return res.sendStatus(404);
    } else if(user) {
			all_ids = user.friends
			video_id = user.watched[0]
			Comments.find({userId: {$in: all_ids}, videoId: video_id}, {commentString: 1, _id: 1, createdAt: 1}, {$orderby: {createdAt: -1}}).then((comments) => {
				return res.json(comments)
			})
		}
	})
})

router.post('/', auth.required, (req, res, next) => {
	const { payload: { id }} = req;
	const { body: { commentString }} = req;
	console.log(id)

  return Users.findById(id, (err, user) => {
    if(err) {
      return res.sendStatus(404);
		}
		else if(user) {
			video_id = user.watched[0]
			comment = {}
			comment.videoId = video_id
			comment.userId = id
			comment.commentString = commentString
			const finalComment = new Comments(comment);

			return finalComment.save()
				.then(() => {
					return Users.findById(id, (err, user) => {
					if(err) {
						return res.sendStatus(404);
					} else if(user) {
						all_ids = user.friends
						video_id = user.watched[0]
						Comments.find({userId: {$in: all_ids}, videoId: video_id}, {commentString: 1, _id: 1})
							.then((comments) => res.json(comments))
					}
				})
			})
		}
	})
})

module.exports = router;