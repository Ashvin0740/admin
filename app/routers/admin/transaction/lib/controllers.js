const { Transaction } = require('../../../../models');

const controller = {};

controller.list = (req, res) => {
    const body = _.pick(req.query, ['start', 'length', 'size', 'pageNumber', 'search', 'draw', 'eType']);
    const startIndex = parseInt(body.start) || 0;
    const endIndex = parseInt(body.length) || 10;
    const sort = { dCreatedDate: -1 };
    const match = { eCategory: 'wallet' };
    const postMatch = {};
    if (body.eType) match.eType = body.eType;

    if (body.search?.value) {
        const search = _.searchRegex(body.search?.value);
        match.$or = [];
        match.$or.push({ sTxHash: { $regex: new RegExp(`^.*${search}.*`, 'i') } }, { eType: { $regex: new RegExp(`^.*${search}.*`, 'i') } });
        postMatch.$or = [{ 'user.sFirstName': { $regex: new RegExp(`^.*${search}.*`, 'i') } }];
    }

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

    const query = [
        {
            $match: match,
        },
        {
            $lookup: {
                from: 'users',
                localField: 'iUserId',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: '$user',
        },
        {
            $match: postMatch,
        },
        {
            $project: {
                eType: true,
                sTxHash: true,
                nReward: true,
                nAmount: true,
                eStatus: true,
                sFirstName: { $ifNull: ['$user.sFirstName', '-'] },
                dCreatedDate: true,
            },
        },
        {
            $facet: {
                transactions: facetArray,
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
    Transaction.aggregate(query, (error, transactions) => {
        if (error) return res.reply(messages.error(), error.toString());
        if (!transactions.length)
            return res.reply(messages.success(), {
                data: [],
                draw: body.draw,
                recordsTotal: 0,
                recordsFiltered: 0,
            });

        res.reply(messages.success(), {
            data: transactions[0].transactions,
            draw: body.draw,
            recordsTotal: transactions[0].count.recordsTotal,
            recordsFiltered: transactions[0].count.recordsTotal,
        });
    });
};

module.exports = controller;
