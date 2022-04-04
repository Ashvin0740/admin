const router = require('express').Router();
const middleware = require('./lib/middleware');
const controller = require('./lib/controllers');

router.use(middleware.isAuthenticated);

router.get('/list', controller.list);
router.get('', controller.view);

module.exports = router;
