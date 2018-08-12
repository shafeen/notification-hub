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

    router.use('/blink1', require('./public/blink1'));


    return router;
};
