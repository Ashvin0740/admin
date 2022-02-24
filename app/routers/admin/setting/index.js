const router = require('express').Router();
const controllers = require('./lib/controllers');
const { isAuthenticated } = require('./lib/middlewares');

router.use(isAuthenticated);
router.get('/', controllers.get);
router.post('/update', controllers.updateSetting);

module.exports = router;
