const mongoose = require('mongoose');

const Setting = mongoose.Schema({
    nEntryFee: Number,
    nWinningAmount: Number,
});

module.exports = mongoose.model('settings', Setting);
