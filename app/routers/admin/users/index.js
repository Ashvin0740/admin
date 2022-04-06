const router = require('express').Router();
const middleware = require('./lib/middleware');
const controller = require('./lib/controllers');

router.use(middleware.isAuthenticated);

router.get('/list', controller.list);
router.get('/view/:iUserId', controller.view);
router.get('/statistics/:iUserId', controller.view);
router.post('/update', controller.update);

module.exports = router;
