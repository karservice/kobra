export default class Event {
  constructor($http) {
    'ngInject';

    this._$http = $http;
  }

  get(id, expand) {
    return this._$http({
      url: '/api/v1/events/' + id + '/',
      method: 'GET',
      params: {
        expand: expand
      },
      cache: true
    })
  }

  list(expand) {
    return this._$http({
      url: '/api/v1/events/',
      params: {
        expand: expand
      },
      method: 'GET',
      cache: true
    })
  }
}
