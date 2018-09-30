const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/videos', require('./videos'));

module.exports = router;