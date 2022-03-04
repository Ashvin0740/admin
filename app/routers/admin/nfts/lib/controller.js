const { NFT } = require('../../../../models');

const controller = {};

controller.listNft = (req, res) => {
    const body = _.pick(req.query, ['start', 'length', 'size', 'pageNumber', 'search']);
    const sort = { dCreatedDate: -1 };
    const query = [
        {
            $sort: sort,
        },
        {
            $skip: parseInt(body.start),
        },
        {
            $limit: parseInt(body.length),
        },
        {
            $project: {
                _id: true,
                sFileName: true,
            },
        },
    ];
    NFT.aggregate(query, (error, nfts) => {
        if (error) return res.reply(messages.error(), error.toString());
        res.reply(messages.success(), nfts);
    });
};

controller.view = (req, res) => {
    const { iNftId } = _.pick(req.params, ['iNftId']);
    NFT.findById(iNftId, (error, nft) => {
        if (error) return res.reply(messages.error(), error.toString());
        res.reply(messages.success(), nft);
    });
};

module.exports = controller;
