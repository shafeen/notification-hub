angular.module('basicMEAN')
.component('navbar', {
    templateUrl: '/partials/navbar/navbar',
    controller: "NavbarCtrl as navbar",
    bindings: {
    }
})
.controller('NavbarCtrl', ['$scope', '$http', '$location', '$window', '$timeout', '$state', function ($scope, $http, $location, $window, $timeout, $state) {
    const navbar = this;

    navbar.$state = $state;
    navbar.$location = $location;

    navbar.data = {
        left : {
            public: [
                {
                    uiRouterState: 'view1',
                    displayName: 'View 1'
                },
                {
                    uiRouterState: 'view2',
                    displayName: 'View 2'
                }

            ],
            protected: [
                {
                    uiRouterState: 'view-protected',
                    displayName: 'View-Protected',
                }
            ]
        }
        ,
        right : {
            public : [],
            protected: [
                {
                    uiRouterState: 'profile',
                    displayName: 'Profile',
                }
            ]
        }
    };

    $scope.$on('$locationChangeStart', function (e) {
        navbar.loading = true;
    });
    $scope.$on('$locationChangeSuccess', function (e) {
        navbar.loading = false;
    });

    const LOGIN_URL = '/authenticate/login';
    const LOGIN_SUCCESS_URL = '/#/profile';
    navbar.login = function() {
        let loginParams = {
            email: navbar.loginEmail,
            password: navbar.loginPass
        };
        navbar.loading = true;
        $http.post(LOGIN_URL, loginParams)
            .then(function success() {
                navbar.loading = false;
                $window.location.href = LOGIN_SUCCESS_URL;
                $window.location.reload();
            }, function failure() {
                navbar.loading = false;
                navbar.showLoginErrorMsg = true;
                navbar.loginErrorMsg = 'Login failed';
                $timeout(function () {
                    navbar.showLoginErrorMsg = false;
                }, 4000);
            });
    };

    const SIGNUP_URL = '/authenticate/signup';
    const SIGNUP_SUCCESS_URL = '/#/profile';
    navbar.signup = function () {
        if (verifySignupParams() === false) {
            console.log('there were errors in the signup params!');
            return;
        }

        let signupParams = {
            email: navbar.signupEmail,
            password: navbar.signupPass
        };
        $http.post(SIGNUP_URL, signupParams)
            .then(function success() {
                $window.location.href = SIGNUP_SUCCESS_URL;
                $window.location.reload();
            }, function failure() {
                setSignupErrorMsg('Signup failed. Try again later.', true);
            });
    };

    function verifySignupParams() {
        if (!isValidEmail(navbar.signupEmail)) {
            invalidEmailHandler('You must enter a valid email address.');
            return false;
        }

        let passwordsDontMatch = navbar.signupPass != navbar.signupPassConfirm;
        let passwordValid = passwordsDontMatch ? false : isValidPassword(navbar.signupPass);
        if (passwordsDontMatch) {
            passwordErrorHandler('Your passwords must match.');
            return false;
        }
        if (!passwordValid) {
            passwordErrorHandler('Your password must be at least 8 characters long.');
            return false;
        }
        return true;
    }

    function isValidEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function isValidPassword(password) {
        const MIN_LENGTH = 8;
        // TODO: add a few more password rules (min length, alphanumeric requirement, etc)
        return password.length >= MIN_LENGTH;
    }

    function invalidEmailHandler(message) {
        navbar.emailError = true;
        setSignupErrorMsg(message, true);
        $timeout(function () {
            navbar.emailError = false;
        }, 4000);
    }

    function passwordErrorHandler(message) {
        navbar.passwordError = true;
        setSignupErrorMsg(message, true);
        $timeout(function () {
            navbar.passwordError = false;
        }, 4000);
    }

    function setSignupErrorMsg(message, hideAfterwards) {
        navbar.signupErrorMsg = message;
        navbar.showSignupErrorMsg = true;
        if (hideAfterwards) {
            $timeout(function () {
                navbar.showSignupErrorMsg = false;
            }, 4000);
        }

    }

    navbar.clicked = function () {
        console.log('test click!');
    };
}]);
