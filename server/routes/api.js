const express = require('express');
const router = express.Router();

const authVerifyMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({
            message: 'A user must be logged in.'
        })
    }
};

module.exports = function (settings) {

    // public /api routes entry point
    router.use('/public', require('./api/public')(settings));

    // protected /api routes entry point
    router.use('/protected', authVerifyMiddleware, require('./api/protected')(settings));

    return router;
};
