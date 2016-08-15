class DiscountRegistrationsCtrl {
  constructor(DiscountRegistration) {
    'ngInject';

    this._DiscountRegistration = DiscountRegistration;

    this.registrations = null;

    this.getRegistrations();
  }

  getRegistrations() {
    return this._DiscountRegistration.list('discount.ticket_type', this.eventId, this.studentId).then(
      (res) => {
        console.log(res);
        this.registrations = res.data;
        return res
      }, (err) => {
        console.error(err);
        this.registrations = null;
        return err
      }
    )
  }
}

let discountRegistrationsComponent = {
  controller: DiscountRegistrationsCtrl,
  templateUrl: 'components/discount-registrations.component.html',
  bindings: {
    studentId: '<',
    eventId: '<'
  }
};

export default discountRegistrationsComponent;
