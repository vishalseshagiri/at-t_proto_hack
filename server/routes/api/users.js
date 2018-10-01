const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }
	user.watching = ""
	user.watched = []
	user.badges = {
		"comedy": 0,
		"talk-shows": 0,
		"thrillers": 0,
		"drama": 0,
		"sports": 0
	}

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
		.then(() => {
			var inner_user = finalUser.toAuthJSON()
			user_id = inner_user._id	
			inner_user.friends.push(user_id)
			Users.update({_id: user_id}, {$push: {friends: user_id}})
		    .then(() => res.json({ user: inner_user}));
		})
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/profile', auth.required, (req, res, next) => {
  const id = req.query.user_id;
  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }
      return res.json({ user: user.toAuthJSON() });
    });
});

router.get('/', auth.required, (req, res, next) => {
  return Users.find()
    .then((users) => {
      return res.json(users)
    })
})

module.exports = router;