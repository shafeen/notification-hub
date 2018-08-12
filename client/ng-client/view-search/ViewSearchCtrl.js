angular.module('basicMEAN')
.controller('ViewSearchCtrl', ['$location', 'Search', function ($location, Search) {
    let self = this;

    self.searchViewData = {
        activeSearchTerm: $location.search().searchTerm,
        searchBoxTerm: '',
        searchResults: null
    };
    self.message = `Viewing results for searchTerm = "${self.searchViewData.activeSearchTerm}"`;

    self.displaySearchResults = function (searchTerm) {
        Search.getSearchResults(searchTerm).then(function (results) {
            self.searchViewData.searchResults = results;
            console.log('Search results %o', results);
            //TODO: do something with the search results
        });
    };

    self.initNewSearch = function () {
        Search.viewSearchResults(self.searchViewData.searchBoxTerm);
    };

    self.$onInit = function () {
        if (self.searchViewData.activeSearchTerm) {
            self.displaySearchResults(self.searchViewData.activeSearchTerm);
        }
    };

    self.$onInit();
}]);