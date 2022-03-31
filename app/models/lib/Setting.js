const mongoose = require('mongoose');

const Setting = mongoose.Schema({
    nEntryFee: Number,
    nWinningAmount: Number,
    oReWard: {
        _id: false,
        nBonanza: Number,
        nPercentage: Number,
        nClaimPerDay: Number,
    },
});

module.exports = mongoose.model('settings', Setting);
