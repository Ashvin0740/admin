const mongoose = require('mongoose');

const Admin = mongoose.Schema(
    {
        sFirstName: String,
        sLastName: String,
        sPassword: String,
        sMobile: String,
        sEmail: String,
        sToken: String,
    },
    { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
);

module.exports = mongoose.model('admins', Admin);
