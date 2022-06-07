const mongoose = require('mongoose');

const Statistic = mongoose.Schema(
    {
        sDate: String,
        nBattle: { type: Number, default: 0 },
        nReward: { type: Number, default: 0 },
        nRewardDistribute: { type: Number, default: 0 },
        nUserPlayed: { type: Number, default: 0 },
        nUserWon: { type: Number, default: 0 },
    },
    { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
);

module.exports = mongoose.model('statistics', Statistic);
