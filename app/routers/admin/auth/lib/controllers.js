const { Admin } = require('../../../../models');
const { mailer } = require('../../../../utils');

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
        // res.cookie('token', admin.sToken).reply(messages.successfully('Login'), { authorization: admin.sToken }, { 'Access-Control-Allow-Credentials': true });
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
        const sLink = `${process.env.FRONTEND_URL}/reset-password?token=${sLinkToken}`;
        admin.sVerificationToken = sLinkToken;
        admin.save(_.errorCallback);
        mailer.send({ sLink, type: 'forgotPassword', sEmail: body.sEmail }, _.errorCallback);
        res.reply(messages.success()); // token is send as params in resetpassword api
    });
};

controllers.resetPassword = (req, res) => {
    const body = _.pick(req.body, ['sPassword', 'sConfirmPassword', 'token']);

    const query = { _id: req.admin._id };
    const update = {
        $set: {
            sPassword: _.encryptPassword(body.sPassword),
        },
        $unset: {
            sVerificationToken: true,
        },
    };

    Admin.updateOne(query, update, error => {
        if (error) return res.reply(messages.server_error(), error.toString());
        res.reply(messages.successfully('Your password has been changed'));
    });
};

controllers.logout = (req, res) => {
    Admin.updateOne({ _id: req.admin._id }, { $unset: { sToken: true } }, error => {
        if (error) return res.reply(messages.server_error(), error.toString());
        res.reply(messages.success());
    });
};

controllers.changePassword = (req, res) => {
    const body = _.pick(req.body, ['sCurrentPassword', 'sPassword']);
    if (!body.sPassword) res.reply(messages.not_found('Password'));
    if (!body.sCurrentPassword) res.reply(messages.not_found('current password'));

    Admin.findOne({ _id: req.admin._id }, (error, admin) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        if (admin.sPassword !== _.encryptPassword(body.sCurrentPassword)) return res.reply(messages.custom.wrong_password);
        admin.sPassword = _.encryptPassword(body.sPassword);
        admin.save(_.errorCallback);
        res.reply(messages.successfully('Your password has been changed'));
    });
};

module.exports = controllers;
