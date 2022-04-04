const { requestLimiter } = require('../../../../utils/index');
const { Admin } = require('../../../../models');

const middlewares = {};

middlewares.apiLimiter = (req, res, next) => {
    const params = {
        path: req.path,
        remoteAddress: req.sRemoteAddress || '127.0.0.1',
        maxRequestTime: 1000,
    };
    requestLimiter.setLimit(params, error => {
        if (error) return res.reply(messages.too_many_request());
        next();
    });
};

middlewares.isAuthenticated = (req, res, next) => {
    const token = req.header('authorization');
    if (!token) return res.reply(messages.unauthorized());

    const decodedToken = _.decodeToken(token);
    if (!decodedToken) return res.reply(messages.unauthorized());

    const query = { _id: decodedToken._id };
    Admin.findOne(query, (error, admin) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        if (!admin) return res.reply(messages.custom.user_not_found);
        if (admin.sToken !== token) return res.reply(messages.unauthorized());
        req.admin = admin;
        next();
    });
};

middlewares.verifyToken = (req, res, next) => {
    const body = _.pick(req.body, ['sPassword', 'sConfirmPassword', 'token']);
    if (!body.token) return res.reply(messages.unauthorized());

    const decodedToken = _.verifyToken(body.token);
    if (!decodedToken || decodedToken === 'jwt expired') return res.reply(messages.expired('Link'));
    if (body.sPassword !== body.sConfirmPassword) return res.reply(messages.not_matched('Passwords'));

    const query = { _id: decodedToken._id };
    Admin.findOne(query, (error, admin) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        if (!admin) return res.reply(messages.custom.user_not_found);
        if (admin.sVerificationToken !== body.token) return res.reply(messages.unauthorized());
        req.admin = admin;
        next();
    });
};

module.exports = middlewares;
