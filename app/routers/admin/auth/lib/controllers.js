const { Admin } = require('../../../../models');

const controllers = {};

controllers.register = async (req, res) => {
    const body = _.pick(req.body, ['sEmail', 'sPassword']);
    const adminExists = await Admin.create({ sEmail: body.sEmail });
    if (adminExists) return res.reply(messages.custom.already_exists_email);
    body.sPassword = _.encryptPassword(body.sPassword);
    Admin.create(body, (error, admin) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        res.reply(messages.success(), admin);
    });
};

controllers.login = (req, res) => {
    const body = _.pick(req.body, ['sEmail', 'sPassword']);
    const query = { sEmail: body.sUserName };

    Admin.findOne(query, (error, admin) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        if (!admin) return res.reply(messages.custom.admin_not_found);
        if (admin.eStatus === 'n') return res.reply(messages.custom.user_blocked);
        if (admin.eStatus === 'd') return res.reply(messages.custom.user_deleted);
        if (_.encryptPassword(body.sPassword) !== admin.sPassword) return res.reply(messages.wrong_credentials());

        admin.sToken = _.encodeToken({ _id: admin._id.toString() });
        admin.save(_.emptyCallback);
        return res.reply(messages.success('Login'), {}, { authorization: admin.sToken });
    });
};

module.exports = controllers;
