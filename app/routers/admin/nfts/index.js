const router = require('express').Router();
const controllers = require('./lib/controller');
const { isAuthenticated } = require('./lib/middleware');

router.use(isAuthenticated);
router.get('/list', controllers.listNft);
router.get('/view/:iNftId', controllers.view);
// router.post('/update', controllers.updateSetting);

module.exports = router;
