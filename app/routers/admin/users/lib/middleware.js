const { Admin } = require('../../../../models');

const middleware = {};

middleware.isAuthenticated = (req, res, next) => {
    log.green(req.cookies);
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

module.exports = middleware;
