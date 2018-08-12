angular.module('basicMEAN')
.controller('ViewProtectedCtrl', [function () {
    let self = this;

    self.message = 'This is some more protected text relevant to our protected view.';

}]);