const LocalStrategy = require('passport-local').Strategy;
const UserRepository = require('../library/Repositories/UserRepository');

// TODO: (shafeen) set it up so that we use an UserRepository instead of mongoose directly

module.exports = function (passport) {

    // passport session setup
    // ----------------------
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        UserRepository.findSingleUser({id: id}).then(function(user) {
            done(null, user);
        }).then(null, function (err) {
            done(err);
        });
    });

    // local-signup strategy
    // ---------------------
    // if the strategies weren't named, they would default to "local"
    passport.use('local-signup', new LocalStrategy({
            // local strategy uses username and password by default
            // -> override with email and password
            usernameField: 'email',
            passwordfield: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            // asynchronous
            process.nextTick(function () {
                // TODO: we should be able to request a UserRepository to get this information for us
                UserRepository.findSingleUser({email: email}).then(function (user) {
                    if (user) {
                        let failMsg = 'Email already taken!';
                        console.log(`passport: ${failMsg}`);
                        return done(null, false, req.flash('signupMsg', failMsg));
                    } else {
                        UserRepository.createNewUser({
                            email: email,
                            password: password
                        }).then(function (newUser) {
                            done(null, newUser);
                        }).then(null, function (err) {
                            throw err;
                        });
                    }
                }).then(null, function (err) {
                    return done(err);
                });
            });
        }
    ));

    // local-login strategy
    // --------------------
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            UserRepository.findSingleUser({email: email}).then(function (user) {
                if (!user) {
                    let failMsg = 'No user found.';
                    console.log(`passport: ${failMsg}`);
                    return done(null, false, req.flash('loginMsg', failMsg));
                } else if (!user.validPassword(password)) {
                    let failMsg = 'Wrong password.';
                    console.log(`passport: ${failMsg}`);
                    return done(null, false, req.flash('loginMsg', failMsg));
                } else {
                    return done(null, user);
                }
            }).then(null, function (err) {
                return done(err);
            });
        }
    ));

};