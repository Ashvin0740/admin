const { User, Transaction, MetaGame } = require('../../../../models');
const { mongodb } = require('../../../../utils');

const controller = {};

controller.list = (req, res) => {
    const body = _.pick(req.query, ['start', 'length', 'size', 'pageNumber', 'search', 'draw']);
    const sort = { dCreatedDate: -1 };
    const startIndex = parseInt(body.start) || 0;
    const endIndex = parseInt(body.length) || 10;

    const match = { eStatus: { $ne: 'd' } };

    if (body.search?.value) {
        const search = _.searchRegex(body.search?.value);
        match.$or = [];
        match.$or.push({ sFirstName: { $regex: new RegExp(`^.*${search}.*`, 'i') } }, { sLastName: { $regex: new RegExp(`^.*${search}.*`, 'i') } }, { sWalletAddress: { $regex: new RegExp(`^.*${search}.*`, 'i') } });
    }

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
            $match: match,
        },
        {
            $project: {
                nStamina: true,
                eStatus: true,
                sWalletAddress: true,
                sFirstName: { $ifNull: ['$sFirstName', '-'] },
                sLastName: { $ifNull: ['$sLastName', '-'] },
                dCreatedDate: true,
            },
        },
        {
            $facet: {
                users: facetArray,
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

    User.aggregate(query, (error, users) => {
        if (error) return res.reply(messages.error(), error.toString());
        if (!users.length)
            return res.reply(messages.success(), {
                data: [],
                draw: body.draw,
                recordsTotal: 0,
                recordsFiltered: 0,
            });

        res.reply(messages.success(), {
            data: users[0].users,
            draw: body.draw,
            recordsTotal: users[0].count.recordsTotal,
            recordsFiltered: users[0].count.recordsTotal,
        });
    });
};

controller.view = (req, res) => {
    const { iUserId } = _.pick(req.params, ['iUserId']);
    const query = [
        {
            $match: {
                _id: mongodb.mongify(iUserId),
            },
        },
        {
            $project: {
                sWalletAddress: true,
                sFirstName: { $ifNull: ['$sFirstName', '-'] },
                sLastName: { $ifNull: ['$sLastName', '-'] },
                nStamina: true,
                nWinPercentage: true,
            },
        },
    ];

    User.aggregate(query, (error, [user]) => {
        if (error) return res.reply(messages.error(), error.toString());
        res.reply(messages.success(), user);
    });
};

controller.statistics = async (req, res) => {
    try {
        const body = _.pick(req.params, ['iUserId']);
        const iUserId = mongodb.mongify(body.iUserId);

        const gameQuery = [
            {
                $match: {
                    'aParticipant.iUserId': iUserId,
                },
            },
            {
                $group: {
                    _id: null,
                    nTotalBattle: { $sum: 1 },
                    nTotalWon: { $sum: { $cond: [{ $eq: ['$iWinnerId', iUserId] }, 1, 0] } },
                },
            },
        ];
        const transactionQuery = [
            {
                $match: {
                    iUserId: mongodb.mongify(body.iUserId),
                },
            },
            {
                $group: {
                    _id: null,
                    nTotalEarned: { $sum: { $cond: [{ $and: [{ $eq: ['$eType', 'credit'] }, { $eq: ['$eCategory', 'game'] }] }, '$nAmount', 0] } },
                    nTotalClaim: { $sum: { $cond: [{ $and: [{ $eq: ['$eType', 'debit'] }, { $eq: ['$eCategory', 'wallet'] }] }, '$nAmount', 0] } },
                },
            },
        ];
        const [transactionResult, gameResult] = await Promise.all([Transaction.aggregate(transactionQuery), MetaGame.aggregate(gameQuery)]);
        const response = {
            nTotalEarned: 0,
            nTotalClaim: 0,
            nTotalBattle: 0,
            nTotalWon: 0,
            nTotalLoss: 0,
            nProficiency: 0,
        };

        if (transactionResult.length) {
            response.nTotalEarned = transactionResult[0].nTotalEarned;
            response.nTotalClaim = transactionResult[0].nTotalClaim;
        }
        if (gameResult.length) {
            response.nTotalBattle = gameResult[0].nTotalBattle;
            response.nTotalWon = gameResult[0].nTotalWon;
            response.nTotalLoss = response.nTotalBattle - response.nTotalWon;
            response.nProficiency = response.nTotalWon / (response.nTotalLoss || 1);
        }
        res.reply(messages.success(), response);
    } catch (error) {
        res.reply(messages.error(), error.toString());
    }
};

controller.update = (req, res) => {
    const body = _.pick(req.body, ['iUserId', 'nStamina', 'sFirstName', 'sLastName', 'sWalletAddress', 'eStatus', 'nWinPercentage']);
    const query = { _id: body.iUserId };
    if (body.nWinPercentage && (body.nWinPercentage < 20 || body.nWinPercentage > 60)) return res.reply(messages.custom.invalid_win_range);

    const updateQuery = { $set: body };
    User.updateOne(query, updateQuery, error => {
        if (error) return res.reply(messages.error(), error.toString());
        res.reply(messages.success());
    });
};

controller.delete = (req, res) => {
    const { iUserId } = _.pick(req.body, ['iUserId']);
    User.updateOne({ _id: iUserId }, { $set: { eStatus: 'd' } }, error => {
        if (error) return res.reply(messages.error(), error.toString());
        res.reply(messages.success());
    });
};

module.exports = controller;
