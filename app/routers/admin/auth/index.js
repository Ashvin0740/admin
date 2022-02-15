const router = require('express').Router();
const controllers = require('./lib/controllers');

router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.post('/forgotPassword', controllers.forgotPassword);
router.post('/resetPassword', controllers.resetPassword);

module.exports = router;
