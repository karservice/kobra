function AppConfig($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
  'ngInject';

  /*
    If you don't want hashbang routing, uncomment this line.
    Our tutorial will be using hashbang routing though :)
  */

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

  // $locationProvider.html5Mode(true);
  $stateProvider
  .state('kobra', {
    abstract: true,
    template: '<ui-view/>'
  });



  $urlRouterProvider.otherwise('/');

}

export default AppConfig;
