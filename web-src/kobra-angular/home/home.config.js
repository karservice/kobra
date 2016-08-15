export default function HomeConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('kobra.home', {
      url: '/',
      title: 'Home',
      views: {
        'main@': {
          controller: 'HomeCtrl as $ctrl',
          templateUrl: 'home/home.html'
        }
      }
    });
};
