const router = require('express').Router();
const controller = require('./lib/controllers');

router.get('/login', controller.login);

module.exports = router;
