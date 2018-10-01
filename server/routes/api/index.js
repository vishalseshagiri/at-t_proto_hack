const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/videos', require('./videos'));
router.use('/comments', require('./comments'));

module.exports = router;