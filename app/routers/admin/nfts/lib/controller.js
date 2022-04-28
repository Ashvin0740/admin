const { NFT } = require('../../../../models');

const controller = {};

controller.listNft = (req, res) => {
    const body = _.pick(req.query, ['start', 'length', 'size', 'pageNumber', 'search', 'bMintStatus']);
    const sort = { dCreatedDate: -1 };
    const match = {};
    const startIndex = parseInt(body.start) || 0;
    const endIndex = parseInt(body.length) || 10;
    const facetArray = [
        {
            $sort: sort,
        },
        {
            $skip: startIndex,
        },
        {
            $limit: startIndex + endIndex,
        },
    ];
    if (typeof body.nMintStatus === 'boolean') match.bMintStatus = body.bMintStatus;

    const query = [
        {
            $match: match,
        },
        {
            $project: {
                sFileName: true,
                sUrl: true,
                sTxHash: true,
                nTokenId: true,
            },
        },
        {
            $facet: {
                nfts: facetArray,
                count: [
                    {
                        $count: 'recordsTotal',
                    },
                ],
            },
        },
        {
            $unwind: '$count',
        },
    ];
    NFT.aggregate(query, (error, nfts) => {
        if (error) return res.reply(messages.error(), error.toString());
        if (!nfts.length)
            return res.reply(messages.success(), {
                data: [],
                draw: body.draw,
                recordsTotal: 0,
                recordsFiltered: 0,
            });
        res.reply(messages.success(), {
            data: nfts[0].nfts,
            draw: body.draw,
            recordsTotal: nfts[0].count.recordsTotal,
            recordsFiltered: nfts[0].nfts.length,
        });
    });
};

controller.transactions = (req, res) => {
    const body = _.pick(req.query, ['start', 'length', 'size', 'pageNumber', 'search']);
    const sort = { dCreatedDate: -1 };
    const match = {};
    const startIndex = parseInt(body.start) || 0;
    const endIndex = parseInt(body.length) || 10;
    const facetArray = [
        {
            $sort: sort,
        },
        {
            $skip: startIndex,
        },
        {
            $limit: startIndex + endIndex,
        },
    ];
    match.bMintStatus = true;

    if (body.search?.value) {
        const search = _.searchRegex(body.search?.value);
        match.$or = [];
        match.$or.push({ sTxHash: { $regex: new RegExp(`^.*${search}.*`, 'i') } });
    }

    const query = [
        {
            $match: match,
        },
        {
            $project: {
                sFileName: true,
                sUrl: true,
                sTxHash: true,
                nTokenId: true,
            },
        },
        {
            $facet: {
                nfts: facetArray,
                count: [
                    {
                        $count: 'recordsTotal',
                    },
                ],
            },
        },
        {
            $unwind: '$count',
        },
    ];
    NFT.aggregate(query, (error, nfts) => {
        if (error) return res.reply(messages.error(), error.toString());
        if (!nfts.length)
            return res.reply(messages.success(), {
                data: [],
                draw: body.draw,
                recordsTotal: 0,
                recordsFiltered: 0,
            });
        res.reply(messages.success(), {
            data: nfts[0].nfts,
            draw: body.draw,
            recordsTotal: nfts[0].count.recordsTotal,
            recordsFiltered: nfts[0].nfts.length,
        });
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
