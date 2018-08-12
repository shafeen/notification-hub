const express = require('express');
const router = express.Router();
const settings = require('../config/settings/settings.json');

const NG_CLIENT_RELATIVE_PATH = '../../client/ng-client/';
const NG_CLIENT_SECURE_RELATIVE_PATH = '../../client/ng-client-secure/';

// loading module partial views -- anything more specific should come before
router.get('/:modulename/:partialname', function(req, res) {
    res.render(NG_CLIENT_RELATIVE_PATH + req.params.modulename + '/' + req.params.partialname, {user: req.user, settings: settings});
});

// loading secure module partial views -- anything more specific should come before
router.get('/secure/:modulename/:partialname', isLoggedIn, function(req, res) {
    res.render(NG_CLIENT_SECURE_RELATIVE_PATH + req.params.modulename + '/' + req.params.partialname, {user: req.user, settings: settings});
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).send('Unauthorized request!');
}

module.exports = router;
