const mongoose = require('mongoose');

const Transaction = mongoose.Schema(
    {
        iUserId: mongoose.Schema.Types.ObjectId,
        nAmount: Number,
        nReward: Number,
        eToken: {
            type: String,
            enum: ['meta', 'bnb'],
        },
        eType: {
            type: String,
            enum: ['credit', 'debit'],
        },
        eCategory: {
            type: String,
            enum: ['game', 'wallet'],
        },
    },
    { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
);

module.exports = mongoose.model('transactions', Transaction);
