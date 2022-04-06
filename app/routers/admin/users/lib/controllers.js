const { User } = require('../../../../models');

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
