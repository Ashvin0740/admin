const router = require('express').Router();

const authRoute = require('./auth');
const settingRoute = require('./setting');

router.use('/auth', authRoute);
router.use('/setting', settingRoute);

module.exports = router;
