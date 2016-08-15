export default function LookupConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('kobra.lookup', {
      url: '/lookup',
      title: 'Look up members',
      views: {
        'main@': {
          templateUrl: 'lookup/lookup.html'
        }
      }
    });
};
