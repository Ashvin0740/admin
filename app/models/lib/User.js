const mongoose = require('mongoose');

const User = mongoose.Schema({
    isEmailVerified: Boolean,
    sUserName: String,
    sMobile: String,
    sEmail: String,
    sToken: String,
    sPushToken: String,
    sDeviceToken: String,
    sWalletAddress: String,
    nStamina: {
        type: Number,
        default: 10,
    },
    nOTP: Number,
    eStatus: {
        type: String,
        enum: ['y', 'n', 'd'],
    },
});

module.exports = mongoose.model('users', User);
