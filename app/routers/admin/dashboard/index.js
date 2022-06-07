const router = require('express').Router();
const controllers = require('./lib/controllers');
const middleware = require('./lib/middlewares');

// router.use(middleware.isAuthenticated);
router.get('/statistics', controllers.listStatistic);

module.exports = router;
