const router = module.exports = require('express').Router();

router.use('/activity', require('./activity').router);
router.use('/users', require('./users').router);
router.use('/log', require('./log').router);
