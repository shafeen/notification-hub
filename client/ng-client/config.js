angular.module('basicMEAN', ["ui.router"])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    const appStates = [];

    appStates.push({
        name: 'view1',
        url: '/view1',
        templateUrl: "partials/view1/view1",
        controller: "View1Ctrl as $ctrl"
    });
    appStates.push({
        name: 'view2',
        url: '/view2',
        templateUrl: "partials/view2/view2",
        controller: "View2Ctrl as $ctrl"
    });
    appStates.push({
        name: 'search',
        url: '/search',
        templateUrl: "partials/view-search/view-search",
        controller: "ViewSearchCtrl as $ctrl"
    });
    appStates.push({
        name: 'profile',
        url: '/profile',
        templateUrl: "partials/secure/profile/profile",
        controller: "ProfileCtrl as $ctrl"
    });
    appStates.push({
        name: 'view-protected',
        url: '/view-protected',
        templateUrl: "partials/secure/view-protected/view-protected",
        controller: "ViewProtectedCtrl as $ctrl"
    });

    appStates.forEach(state => {
        $stateProvider.state(state);
    });
    $urlRouterProvider.otherwise('/view1');

}]);

/*
To add a new view, follow these steps:
  - create a folder for the view in ng-client OR ng-client-protected
  - create a template .pug file for the view
  - create a controller for the view
  - preload the controller's js file in layout.pug
  - add a route for the view in the config above 
  - have a link to your view available somewhere
*/
