const express = require('express');
const router = express.Router();
const bearerToken = require('express-bearer-token');

const authVerifyMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({
            message: 'A user must be logged in.'
        })
    }
};

const bearerAuthVerifyMiddleware = (req, res, next) => {
    const ALLOWED_TEST_TOKEN = '1234567890987654321'; // TODO: this is just a test token to be changed later
    if (req.token === ALLOWED_TEST_TOKEN) {
        next();
    } else {
        res.status(401).send('Unauthorized request! Try again with an authorized token.');
    }
};

module.exports = function (settings) {

    // /api/public routes entry point
    router.use('/public', require('./api/public')(settings));

    // /api/protected routes entry point
    router.use('/protected', authVerifyMiddleware, require('./api/protected')(settings));

    // /api/bearer-protected routes entry point
    router.use('/bearer-protected',
        bearerToken(),
        bearerAuthVerifyMiddleware,
        require('./api/bearer-protected')(settings)
    );

    return router;
};
