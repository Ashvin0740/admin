const { Admin } = require('../../../../models');

const controllers = {};

controllers.get = (req, res) => {
    const admin = _.pick(req.admin, ['sFirstName', 'sLastName', 'sEmail', 'sMobile']);
    res.reply(messages.success(), admin);
};

controllers.update = (req, res) => {
    const body = _.pick(req.body, ['sFirstName', 'sLastName', 'sMobile']);
    const query = { _id: req.admin._id };
    const updateQuery = { $set: body };
    Admin.updateOne(query, updateQuery, error => {
        if (error) return res.reply(messages.server_error(), error.toString());
        res.reply(messages.success());
    });
};

module.exports = controllers;
