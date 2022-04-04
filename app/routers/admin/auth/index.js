const router = require('express').Router();
const controllers = require('./lib/controllers');
const middleware = require('./lib/middlewares');

router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.post('/forgotPassword', controllers.forgotPassword);
router.post('/resetPassword', middleware.verifyToken, controllers.resetPassword);
router.post('/logout', middleware.isAuthenticated, controllers.logout);

module.exports = router;
