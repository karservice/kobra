export default class Organization {
  constructor($http) {
    'ngInject';

    this._$http = $http;
  }

  list(expand) {
    return this._$http({
      url: '/api/v1/organizations/',
      method: 'GET',
      params: {
        expand: expand
      },
      cache: true
    })
  }
}
