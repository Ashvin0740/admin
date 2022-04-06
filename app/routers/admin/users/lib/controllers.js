const { User, Transaction, MetaGame } = require('../../../../models');
const { mongodb } = require('../../../../utils');

const controller = {};

controller.list = (req, res) => {
    const body = _.pick(req.query, ['start', 'length', 'size', 'pageNumber', 'search']);
    const sort = { dCreatedDate: -1 };
    const startIndex = parseInt(body.start) || 1;
    const endIndex = parseInt(body.length) || 10;

    const facetArray = [
        {
            $sort: sort,
        },
        {
            $skip: startIndex,
        },
        {
            $limit: endIndex,
        },
    ];

    const query = [
        {
            $match: {
                eStatus: { $ne: 'd' },
            },
        },
        {
            $project: {
                dCreatedDate: true,
                eStatus: true,
                sWalletAddress: true,
                sFirstName: { $ifNull: ['$sFirstName', '-'] },
                sLastName: { $ifNull: ['$sLastName', '-'] },
                nStamina: true,
            },
        },
        {
            $facet: {
                users: facetArray,
                count: [
                    {
                        $count: 'totalData',
                    },
                ],
            },
        },
    ];

    User.aggregate(query, (error, users) => {
        if (error) return res.reply(messages.error(), error.toString());
        res.reply(messages.success(), users);
    });
};

controller.view = (req, res) => {
    const { iUserId } = _.pick(req.body, ['iUserId']);
    User.findById(iUserId, (error, user) => {
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
                $group: {
                    _id: null,
                    nTotalBattle: { $sum: { $cond: [{ $eq: ['$aParticipant.iUserId', iUserId] }, 1, 0] } },
                    nTotalWon: { $sum: { $cond: [{ $eq: ['$iWinnerId', iUserId] }, 1, 0] } },
                },
            },
        ];
        const transactionQuery = [
            {
                $match: {
                    iUserId,
                },
                $group: {
                    _id: null,
                    nTotalEarned: { $sum: { $cond: [{ $and: [{ $eq: ['$eType', 'credit'] }, { $eq: ['$eCategory', 'game'] }] }, '$nAmount', 0] } },
                    nTotalClaim: { $sum: { $cond: [{ $and: [{ $eq: ['$eType', 'debit'] }, { $eq: ['$eCategory', 'wallet'] }] }, '$nAmount', 0] } },
                },
            },
        ];
        const [transactionResult, gameResult] = await Promise.all(Transaction.aggregate(transactionQuery), MetaGame.aggregate(gameQuery));
        const response = {
            nTotalEarned: 0,
            nTotalClaim: 0,
            nTotalBattle: 0,
            nTotalWon: 0,
            nTotalLoss: 0,
        };
        if (transactionResult.length) {
            response.nTotalEarned = transactionResult[0].nTotalEarned;
            response.nTotalClaim = transactionResult[0].nTotalClaim;
        }
        if (gameResult.length) {
            response.nTotalBattle = gameResult[0].nTotalBattle;
            response.nTotalWon = gameResult[0].nTotalWon;
            response.nTotalLoss = response.nTotalBattle - response.nTotalWon;
        }
        res.reply(messages.success(), response);
    } catch (error) {
        res.reply(messages.error(), error.toString());
    }
};

controller.update = (req, res) => {
    const body = _.pick(req.body, ['iUserId', 'nStamina', 'sFirstName', 'sLastName', 'sWalletAddress', 'eStatus']);
    const query = { _id: body.iUserId };
    const updateQuery = { $set: body };
    User.updateOne(query, updateQuery, error => {
        if (error) return res.reply(messages.error(), error.toString());
        res.reply(messages.success());
    });
};

module.exports = controller;
