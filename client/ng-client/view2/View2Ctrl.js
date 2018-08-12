angular.module('basicMEAN')
.controller('View2Ctrl', ['Settings', function (Settings) {
    let self = this;

    self.message = 'This is some more text relevant to view 2, but is stored in the View2Ctrl.';

    self.$onInit = function () {
        Settings.init.then(function () {
            self.message = Settings.data.view2Msg;
        })
    };
}]);
