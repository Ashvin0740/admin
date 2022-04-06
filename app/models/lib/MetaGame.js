const mongoose = require('mongoose');

const Game = mongoose.Schema(
    {
        aParticipant: [],
        nEntryFee: Number,
        nWinning: Number,
        sRegion: String,
        iWinnerId: mongoose.Schema.Types.ObjectId,
        eState: {
            type: String,
            enum: ['waiting', 'finished', 'playing'],
        },
    },
    { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
);

module.exports = mongoose.model('meta-games', Game);
