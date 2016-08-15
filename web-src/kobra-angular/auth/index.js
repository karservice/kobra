import angular from 'angular';

import Auth from './auth.service';
import AuthConfig from './auth.config';
import AuthCtrl from './auth.controller';


let authModule = angular.module('kobra.auth', []);
authModule.config(AuthConfig);

// Controllers
authModule.controller('AuthCtrl', AuthCtrl);

// Services
authModule.service('Auth', Auth);


export default authModule;
