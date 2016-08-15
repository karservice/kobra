export default class AuthManager {
  constructor(AppConstants, $http, $window) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;
    this._$window = $window;

    this.tokenKey = 'authToken';

    // Object to store our user properties
    this.currentUser = null;
  }

  setToken(token) {
    this._$window.localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return this._$window.localStorage.getItem(this.tokenKey);
  }

  unsetToken() {
    this._$window.localStorage.removeItem(this.tokenKey);
  }

  login(email, password) {
    return this._$http({
      url: '/api/v1/auth/login/',
      method: 'POST',
      data: {
        email: email,
        password: password
      }
    }).then(
      (res) => {
        console.log(res);
        this.setToken(res.data.token);

        this.currentUser = res.data;

        return res;
      }
    )
  }
}
