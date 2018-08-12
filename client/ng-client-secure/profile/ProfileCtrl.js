angular.module('basicMEAN')
.controller('ProfileCtrl', ['Settings', function (Settings) {
    let self = this;

    self.message = 'This is some more text relevant to the profile page, but is stored in the ProfileCtrl.';

    self.$onInit = function () {
        Settings.init.then(function () {
            self.message = Settings.data.profileMsg;
        })
    };

    self.$onInit();
}]);