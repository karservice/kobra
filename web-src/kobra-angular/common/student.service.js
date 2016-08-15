export default class Student {
  constructor($http) {
    'ngInject';

    this._$http = $http;
  }
  
  get(query, expand) {
    return this._$http({
      url: '/api/v1/students/' + query + '/',
      params: {
        expand: expand
      },
      method: 'GET'
    })
  }
};
