const router = require('express').Router();

const authRoute = require('./auth');
const settingRoute = require('./setting');
const nftsRoute = require('./nfts');
const userRoute = require('./users');

router.use('/auth', authRoute);
router.use('/setting', settingRoute);
router.use('/nfts', nftsRoute);
router.use('/users', userRoute);

module.exports = router;
