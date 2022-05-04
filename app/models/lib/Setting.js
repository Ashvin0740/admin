const mongoose = require('mongoose');

const Setting = mongoose.Schema(
    {
        nEntryFee: Number,
        nWinningAmount: Number,
        oScheduledReward: {
            _id: false,
            nBonanza: Number,
            nPercentage: Number,
            nClaimPerDay: Number,
        },
        oReward: {
            _id: false,
            nBonanza: Number,
            nPercentage: Number,
            nClaimPerDay: Number,
        },
    },
    { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
);

module.exports = mongoose.model('settings', Setting);
