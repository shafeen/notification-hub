const express = require('express');
const router = express.Router();

// public /api routes
// ------------------
module.exports = function (settings) {

    router.get('/test', (req, res) => {
        res.json({
            message: 'responded via test public api endpoint'
        })
    });



    return router;
};
