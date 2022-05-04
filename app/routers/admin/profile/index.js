const router = require('express').Router();
const controllers = require('./lib/controllers');
const { isAuthenticated } = require('./lib/middleware');

router.use(isAuthenticated);
router.get('/', controllers.get);
router.post('/update', controllers.update);

module.exports = router;
