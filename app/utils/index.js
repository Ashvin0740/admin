const redis = require('./lib/redis');
const mongodb = require('./lib/mongodb');
const requestLimiter = require('./lib/request-limiter');
const mailer = require('./lib/mailer');

module.exports = {
    redis,
    mongodb,
    requestLimiter,
    mailer,
};
