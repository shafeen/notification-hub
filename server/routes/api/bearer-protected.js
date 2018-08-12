const express = require('express');
const router = express.Router();

// bearer-protected /api routes
// ---------------------
module.exports = function (settings) {

    router.get('/test', (req, res) => {
        res.json({
            message: 'responded via test bearer-protected api endpoint'
        })
    });

    return router;
};
