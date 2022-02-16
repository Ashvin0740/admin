const { Admin } = require('../../../../models');

const controllers = {};

controllers.register = async (req, res) => {
    const body = _.pick(req.body, ['sEmail', 'sPassword']);
    const adminExists = await Admin.findOne({ sEmail: body.sEmail });
    if (adminExists) return res.reply(messages.custom.already_exists_email);
    body.sPassword = _.encryptPassword(body.sPassword);
    Admin.create(body, (error, admin) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        res.reply(messages.success(), admin);
    });
};

controllers.login = (req, res) => {
    const body = _.pick(req.body, ['sEmail', 'sPassword']);
    const query = { sEmail: body.sEmail };

    Admin.findOne(query, (error, admin) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        if (!admin) return res.reply(messages.custom.user_not_found);
        if (admin.eStatus === 'n') return res.reply(messages.custom.user_blocked);
        if (admin.eStatus === 'd') return res.reply(messages.custom.user_deleted);
        if (_.encryptPassword(body.sPassword) !== admin.sPassword) return res.reply(messages.wrong_credentials());

        admin.sToken = _.encodeToken({ _id: admin._id.toString() });
        admin.save(_.errorCallback);
        return res.reply(messages.success('Login'), { authorization: admin.sToken }, { authorization: admin.sToken, 'Access-Control-Expose-Headers': '*' });
    });
};

controllers.forgotPassword = (req, res) => {
    const body = _.pick(req.body, ['sEmail']);

    const query = { sEmail: body.sEmail };

    Admin.findOne(query, (error, admin) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        if (!admin) return res.reply(messages.custom.user_not_found);

        const sLinkToken = _.encodeToken({ sEmail: body.sEmail }, { expiresIn: '1h' });
        const link = `${process.env.FRONTEND_URL}/reset-password.html?token=${sLinkToken}`;
        res.reply(messages.no_prefix('Redirecting to resetting password'), link); // token is send as params in resetpassword api
    });
};

controllers.resetPassword = (req, res) => {
    const body = _.pick(req.body, ['sPassword', 'sConfirmPassword', 'token']);
    if (!body.token) return res.reply(messages.unauthorized());

    const decodedToken = _.verifyToken(body.token);
    if (!decodedToken || decodedToken === 'jwt expired') return res.reply(messages.expired('Link'));
    if (body.sPassword !== body.sConfirmPassword) return res.reply(messages.not_matched('Passwords'));

    const query = { sEmail: decodedToken.sEmail };
    const update = {
        $set: {
            sPassword: _.encryptPassword(body.sPassword),
        },
    };

    Admin.updateOne(query, update, error => {
        if (error) return res.reply(messages.server_error(), error.toString());
        res.reply(messages.successfully('Your password has been changed'));
    });
};

module.exports = controllers;
