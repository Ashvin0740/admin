const mongoose = require('mongoose');

const User = mongoose.Schema({
    sUserName: String,
    sMobile: String,
    sEmail: String,
    sToken: String,
    sPushToken: String,
    sDeviceToken: String,
    isEmailVerified: Boolean,
    sWalletAddress: String,
    nOTP: Number,
    eStatus: {
        type: String,
        enum: ['y', 'n', 'd'],
    },
});

module.exports = mongoose.model('users', User);
