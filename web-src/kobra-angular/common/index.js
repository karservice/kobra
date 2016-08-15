import angular from 'angular';

import DiscountRegistration from './discount-registration.service';
import Event from './event.service';
import Organization from './organization.service';
import Student from './student.service'


let commonModule = angular.module('kobra.common', []);

commonModule.service('DiscountRegistration', DiscountRegistration);
commonModule.service('Event', Event);
commonModule.service('Organization', Organization);
commonModule.service('Student', Student);

export default commonModule;
