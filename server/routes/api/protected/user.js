const express = require('express');
const router = express.Router();
const LIBRARY_PATH = '../../../library';
const UserApiController = require(
    `${LIBRARY_PATH}/ApiControllers/UserApiController`
);

module.exports = function (settings) {
    let userApiController = null;

    router.use((req, res, next) => {
        userApiController = new UserApiController(req.user);
        next();
    });

    router.get('/info', (req, res) => {
        res.json({
            userEmail: userApiController.getUserInfo()
        });
    });

    return router;
};