const controller = {};

controller.login = (req, res) => {
    res.render('Admin/login', { req, res });
};

module.exports = controller;
