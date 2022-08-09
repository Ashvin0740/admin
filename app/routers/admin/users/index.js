const router = require('express').Router();
const middleware = require('./lib/middleware');
const controller = require('./lib/controllers');

// router.use(middleware.isAuthenticated);

router.get('/list', controller.list);
router.get('/view/:iUserId', controller.view);
router.get('/statistics/:iUserId', controller.statistics);
router.post('/update', controller.update);
router.post('/delete', controller.delete);

module.exports = router;
