const router = require('express').Router();

const authRoute = require('./auth');
const settingRoute = require('./setting');
const nftsRoute = require('./nfts');
const userRoute = require('./users');
const transactionRoute = require('./transaction');

router.use('/auth', authRoute);
router.use('/setting', settingRoute);
router.use('/nfts', nftsRoute);
router.use('/users', userRoute);
router.use('/transaction', transactionRoute);

module.exports = router;
