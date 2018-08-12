angular.module('basicMEAN')
.service('Search', ['$location', '$http', '$q', function ($location, $http, $q) {
    let self = this;

    self.SEARCH_VIEW_ROUTE = '/search'; // TODO: create a config service
    self.searchData = {
        latestSearchTerm : null
    };

    self.viewSearchResults = function (searchTerm) {
        if (!searchTerm) {
            console.error('A search term must be provided!');
            return;
        }
        self.searchData.latestSearchTerm = searchTerm;
        $location.path(self.SEARCH_VIEW_ROUTE).search({
            searchTerm: searchTerm
        });
    };

    self.getSearchResults = function (searchTerm) {
        // TODO: complete this stub with the logic in your Search implementation
        // TODO: this function needs to return a promise with ACTUAL results
        return $q(function (resolve, reject) {
            resolve([
                'Sample result 1',
                'Sample result 2',
                'Sample result 3',
                'Sample result 4'
            ]);
        });
    };

}]);