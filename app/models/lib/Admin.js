const mongoose = require('mongoose');

const Admin = mongoose.Schema({
    sUserName: String,
    sMobile: String,
    sEmail: String,
    sToken: String,
    isEmailVerified: Boolean,
    nOTP: Number,
});

module.exports = mongoose.model('admins', Admin);
