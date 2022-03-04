const router = require('express').Router();

const authRoute = require('./auth');
const settingRoute = require('./setting');
const nftsRoute = require('./nfts');

router.use('/auth', authRoute);
router.use('/setting', settingRoute);
router.use('/nfts', nftsRoute);

module.exports = router;
