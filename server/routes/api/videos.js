const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const Videos = mongoose.model('Videos');
const Users = mongoose.model('Users');

router.param('id', (req, res, next, id) => {
  return Videos.findById(id, (err, video) => {
    if(err) {
      return res.sendStatus(404);
    } else if(video) {
			req.video = video
			return Videos.find({genre:video.genre, _id: {$ne: id}})
			.then((videos) => {
				req.genre = video.genre
				req.recommended = videos
	      return next();
			})
    }
  }).catch(next);
});

//GET current video route (required, only authenticated users have access)
router.get('/:id', auth.required, (req, res, next) => {
	const { payload: { id } } = req;
	const { genre } = req;
	const { video } = req;
	const { recommended } = req;

	return Users.findById(id)
	.then((user) => {
		if(!user) {
			return res.sendStatus(400);
		}

		return_obj = { user: user.toAuthJSON(video_id=video._id, genre_name=genre)}

		return_obj = {...return_obj, video: video, recommended: recommended}
		Users.update({_id:id}, {$set: {watched: user.watched, watching: user.watching, badges: user.badges}}, {upsert: true}, function(err) {})
		return res.json(return_obj)
	});

})

router.get('/', auth.required, (req,res, next) => {
	const user_id = req.query.user_id

	return Users.findById(user_id, 'watched')
	.then((user) => {
		var watched = user.watched;
		Videos.find({_id : { $in : watched}}).then((videos) => {
			return res.json(videos)
		})
	})
})

module.exports = router;