const mongoose = require('mongoose');

const User = mongoose.Schema(
    {
        isEmailVerified: Boolean,
        sUserName: String,
        sFirstName: String,
        sLastName: String,
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
        nWinPercentage: {
            type: Number,
            default: 50,
        },
        nOTP: Number,
        eStatus: {
            type: String,
            enum: ['y', 'n', 'd'],
        },
    },
    { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
);

module.exports = mongoose.model('users', User);
