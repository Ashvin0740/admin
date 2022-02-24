const mongoose = require('mongoose');

const NFT = mongoose.Schema({
    sFileName: String,
    sUrl: String,
    oDog: {
        _id: false,
        sName: String,
        nValue: Number,
    },
    oTank: {
        _id: false,
        sName: String,
        nValue: Number,
    },
    oGun: {
        _id: false,
        sName: String,
        nValue: Number,
    },
    oHeadWear: {
        _id: false,
        sName: String,
    },
    nStrength: Number,
    nAttack: Number,
    nDefence: Number,
});

module.exports = mongoose.model('nft', NFT);
