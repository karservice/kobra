import angular from 'angular';

import LookupConfig from './lookup.config';

let lookupModule = angular.module('kobra.lookup', []);

lookupModule.config(LookupConfig);
