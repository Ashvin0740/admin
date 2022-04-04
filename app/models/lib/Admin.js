const mongoose = require('mongoose');

const Admin = mongoose.Schema({
    sUserName: String,
    sPassword: String,
    sMobile: String,
    sEmail: String,
    sToken: String,
    sVerificationToken: String,
    isEmailVerified: Boolean,
    nOTP: Number,
});

module.exports = mongoose.model('admins', Admin);
