const express = require('express');
const router = express.Router();
const settings = require('../config/settings/settings.json');

const AUTHENTICATE_BASE_URL = '/authenticate';

module.exports = function (passport) {

    router.get('/', function (req, res, next) {
        if (req.isAuthenticated()) {
            res.render('index', {
                user: req.user,
                logoutUrl: AUTHENTICATE_BASE_URL + '/logout'
            });
        } else {
            res.render('index');
        }
    });

    router.use('/partials', require('./partials'));

    router.use(AUTHENTICATE_BASE_URL, require('./authenticate')(passport));

    router.get('/signup', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/#/profile');
        } else {
            res.render('signup', {
                title: 'Create an account',
                signupUrl: AUTHENTICATE_BASE_URL + '/signup',
                signupMsg: req.flash('signupMsg')
            });
        }
    });

    router.get('/login', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/#/profile');
        } else {
            res.render('login', {
                title: 'Log in',
                loginUrl: AUTHENTICATE_BASE_URL + '/login',
                loginMsg: req.flash('loginMsg')
            });
        }
    });

    // TODO: (shafeen) set up api routes controllers in the library
    router.use('/api', require('./api')(settings));

    router.use(/.*/, (req, res) => {
        // Redirect to the home page if no routes match
        res.redirect('/');
    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        }
        // redirect them to the home page otherwise
        res.redirect('/');
    }

    return router;
};
