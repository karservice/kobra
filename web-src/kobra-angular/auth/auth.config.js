export default function AuthConfig($stateProvider, $httpProvider) {
  'ngInject';

  // Define the routes
  $stateProvider
    .state('kobra.login', {
      url: '/login',
      controller: 'AuthCtrl as $ctrl',
      templateUrl: 'auth/auth.html',
      title: 'Sign in'
    })

    .state('kobra.register', {
      url: '/register',
      controller: 'AuthCtrl as $ctrl',
      templateUrl: 'auth/auth.html',
      title: 'Sign up'
    });

};
