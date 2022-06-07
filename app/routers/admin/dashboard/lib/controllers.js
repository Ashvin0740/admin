const { Statistic } = require('../../../../models');

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

module.exports = controller;
