const router = require('express').Router();

router.use('/articles', require('./articles'));
router.use('/users', require('./users'));
router.use('/videos', require('./videos'));

module.exports = router;