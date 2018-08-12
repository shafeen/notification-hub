angular.module('basicMEAN')
.service('Settings', ['$http', function ($http) {
    let self = this;

    self.data = null;

    // always call this init function before trying to access the "data" property
    self.init = $http.get("/settings/settings.json")
        .then(function (response) {
            self.data = response.data;
        });
}]);