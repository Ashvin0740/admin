const _ = require('../../../../../globals/lib/helper');
const { Setting } = require('../../../../models');
const { redis } = require('../../../../utils');

const controllers = {};

controllers.get = (req, res) => {
    Setting.findOne({}, (error, settings) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        res.reply(messages.success(), settings);
    });
};

controllers.updateSetting = (req, res) => {
    redis.deleteAsync('meta:settings');
    const body = _.pick(req.body, ['nEntryFee', 'nWinningAmount', 'oScheduledReward', 'nMaxNftUse']);
    const updateQuery = { $set: body };
    if (body.oScheduledReward?.nPercentage && !_.validateRewardPercentage(body.oScheduledReward.nPercentage)) return res.reply(messages.custom.invalid_percentage);
    Setting.findOneAndUpdate({}, updateQuery, { new: true }, error => {
        if (error) res.reply(messages.server_error(), error.toString());
        res.reply(messages.success());
    });
};

module.exports = controllers;
