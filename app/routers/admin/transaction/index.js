const router = require('express').Router();
const controllers = require('./lib/controllers');
const { isAuthenticated } = require('./lib/middleware');

router.use(isAuthenticated);
router.get('/list', controllers.list);

module.exports = router;
