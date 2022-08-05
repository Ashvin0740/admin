const { Statistic, NFT, User } = require('../../../../models');

const controller = {};

controller.listStatistic = (req, res) => {
    const body = _.pick(req.query, ['start', 'length', 'size', 'pageNumber', 'draw', 'search']);
    const sort = { dCreatedDate: -1 };
    const startIndex = parseInt(body.start) || 0;
    const endIndex = parseInt(body.length) || 10;
    const facetArray = [
        {
            $sort: sort,
        },
        {
            $limit: startIndex + endIndex,
        },
        {
            $skip: startIndex,
        },
    ];

    const query = [
        {
            $project: {
                sDate: true,
                nBattle: true,
                nRewardDistribute: true,
                nUserPlayed: true,
                nUserWon: true,
                nReward: true,
                dCreatedDate: true,
            },
        },
        {
            $facet: {
                statistics: facetArray,
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

    Statistic.aggregate(query, (error, statistics) => {
        if (error) return res.reply(messages.error(), error.toString());
        if (!statistics.length)
            return res.reply(messages.success(), {
                data: [],
                draw: body.draw,
                recordsTotal: 0,
                recordsFiltered: 0,
            });
        res.reply(messages.success(), {
            data: statistics[0].statistics,
            draw: body.draw,
            recordsTotal: statistics[0].count.recordsTotal,
            recordsFiltered: statistics[0].count.recordsTotal,
        });
    });
};

controller.dashboard = async (req, res) => {
    const userQuery = [
        {
            $group: {
                _id: null,
                nTotalUser: { $sum: 1 },
                nActiveUser: { $sum: { $cond: [{ $eq: ['$eStatus', 'y'] }, 1, 0] } },
            },
        },
    ];

    const NFTQuery = [
        {
            $group: {
                _id: null,
                nTotalNFT: { $sum: 1 },
                nSoldNFT: { $sum: { $cond: [{ $ifNull: ['$sWalletAddress', false] }, 1, 0] } },
                nRemainingNFT: { $sum: { $cond: [{ $ifNull: ['$sWalletAddress', false] }, 0, 1] } },
            },
        },
    ];

    const [[userResponse], [nftResponse]] = await Promise.all([User.aggregate(userQuery), NFT.aggregate(NFTQuery)]);
    const response = {
        nTotalUser: 0,
        nActiveUser: 0,
        nTotalNFT: 0,
        nSoldNFT: 0,
        nRemainingNFT: 0,
    };
    res.reply(messages.success(), { ...response, ...userResponse, ...nftResponse });
};

module.exports = controller;
