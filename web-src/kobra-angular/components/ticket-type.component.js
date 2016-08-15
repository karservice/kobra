class TicketTypeCtrl {
  constructor($uibModal, DiscountRegistration) {
    'ngInject';

    this._$uibModal = $uibModal;
    this._DiscountRegistration = DiscountRegistration;
  }

  $onChanges(changes) {
    // This method is run every time the one-way bindings are updated.
    this.getEligibleDiscount = null;

    this.registerDiscountFailed = false;
    this.registerDiscountFailedDetail = null;

    this.registrations = null;

    this.getEligibleDiscount();
    this.getRegistrations();
  }

  getEligibleDiscount() {
    if (this.student.union === null) {
      this.getEligibleDiscount = null;
    } else {
      this.getEligibleDiscount = this.ticketType.discounts.find((discount) => {
        return discount.union === this.student.union.url
      })
    }
  }

  getRegistrations() {
    return this._DiscountRegistration.list('discount.union', this.student.id,
                                           this.ticketType.id).then(
      (res) => {
        this.registrations = res.data;
        return res
      }, (err) => {
        console.error(err);
        this.registrations = null;
        return err
      }
    )
  }

  registerDiscount() {
    return this._DiscountRegistration.create(this.getEligibleDiscount.url,
      this.student.url).then(
      (res) => {
        this.registerDiscountFailed = false;
        this.registerDiscountFailedDetail = null;
        this.getRegistrations();
        return res;
      }, (err) => {
        this.registerDiscountFailed = true;
        this.registerDiscountFailedDetail = err.data.detail;
        console.error(err);
        return err;
      }
    )
  }

  unregisterDiscount(registration) {
    return this._DiscountRegistration.remove(registration.id).then(
      (res) => {
        this.getRegistrations();
        return res;
      }, (err) => {
        return err;
      }
    );
  }

  openUnregisterModal(registration) {
    this._$uibModal.open({
      templateUrl: 'register/confirm-unregistration.modal.html',
      size: 'sm'
    }).result.then(
      () => {
        this.unregisterDiscount(registration);
      }
    );
  }
}

let ticketTypeComponent = {
  bindings: {
    student: '<',
    ticketType: '<'
  },
  controller: TicketTypeCtrl,
  templateUrl: 'components/ticket-type.component.html'
};

export default ticketTypeComponent;
