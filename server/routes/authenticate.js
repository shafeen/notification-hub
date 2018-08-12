const express = require('express');
const router = express.Router();

const URL_SIGNUP_SUCCESS = '/#/profile';
const URL_SIGNUP_FAILURE = '/signup';
const URL_LOGIN_SUCCESS  = '/#/profile';
const URL_LOGIN_FAILURE  = '/login';
const URL_LOGOUT_SUCCESS = '/';

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect(URL_LOGOUT_SUCCESS);
});

module.exports = function(passport) {
    // Non-ajax signup routes
    // router.post('/signup', function(req, res, next){
    //     console.log('Starting Signup..');
    //     return next();
    // }, passport.authenticate('local-signup', {
    //     successRedirect: URL_SIGNUP_SUCCESS,
    //     failureRedirect: URL_SIGNUP_FAILURE,
    //     failureFlash: true
    // }));

    router.post('/signup', function(req, res, next){
        console.log('Starting Signup..');
        passport.authenticate('local-signup', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                return res.status(400).json({
                    message: 'signup failed'
                });
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.status(200).json({
                    user: user.username
                });
            });
        })(req, res, next);
    });

    // Non-ajax login routes
    // router.post('/login', function(req, res, next){
    //     console.log('Starting Log in process..');
    //     return next();
    // }, passport.authenticate('local-login', {
    //     successRedirect: URL_LOGIN_SUCCESS,
    //     failureRedirect: URL_LOGIN_FAILURE,
    //     failureFlash: true
    // }));
    router.post('/login', function(req, res, next){
        console.log('Starting Login..');
        passport.authenticate('local-login', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                return res.status(400).json({
                    message: 'incorrect username or password'
                });
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.status(200).json({
                    user: user.username
                });
            });
        })(req, res, next);
    });

    return router;
};
