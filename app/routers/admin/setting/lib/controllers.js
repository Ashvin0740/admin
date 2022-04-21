const { Setting } = require('../../../../models');

const controllers = {};

controllers.get = (req, res) => {
    Setting.findOne({}, (error, settings) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        res.reply(messages.success(), settings);
    });
};

controllers.updateSetting = (req, res) => {
    const body = _.pick(req.body, ['nEntryFee', 'nWinningAmount', 'oReward', 'oScheduledReward']);
    const updateQuery = { $set: body };
    Setting.findOneAndUpdate({}, updateQuery, { new: true }, error => {
        if (error) res.reply(messages.server_error(), error.toString());
        res.reply(messages.success());
    });
};

module.exports = controllers;
