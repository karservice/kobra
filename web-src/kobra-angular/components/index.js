import angular from 'angular';

import discountRegistrationsComponent from './discount-registrations.component';
import eventSelectComponent from './event-select.component';
import listErrors from './list-errors.component';
import mainNavComponent from './main-nav.component';
import searchBarComponent from './search-bar.component';
import ticketTypeComponent from './ticket-type.component';

let componentsModule = angular.module('kobra.components', []);

// Components (and directives)
componentsModule.component('kobraDiscountRegistrations',
                           discountRegistrationsComponent);
componentsModule.component('kobraEventSelect', eventSelectComponent);
componentsModule.component('listErrors', listErrors);
componentsModule.component('kobraMainNav', mainNavComponent);
componentsModule.component('kobraSearchBar', searchBarComponent);
componentsModule.component('kobraTicketType', ticketTypeComponent);

export default componentsModule;
