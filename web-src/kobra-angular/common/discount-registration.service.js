export default class DiscountRegistration {
  constructor($http) {
    'ngInject';

    this._$http = $http;
  }

  list(expand, studentId, ticketTypeId) {
    return this._$http({
      url: '/api/v1/discount-registrations/',
      method: 'GET',
      params: {
        student: studentId,
        ticket_type: ticketTypeId,
        expand: expand
      }
    })
  }

  create(discountUrl, studentUrl) {
    return this._$http({
      url: '/api/v1/discount-registrations/',
      method: 'POST',
      data: {
        discount: discountUrl,
        student: studentUrl
      }
    })
  }

  remove(discountRegistrationId) {
    return this._$http({
      url: '/api/v1/discount-registrations/' + discountRegistrationId + '/',
      method: 'DELETE'
    });
  }
}
