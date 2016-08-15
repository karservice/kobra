class EventSelectCtrl {
  constructor(Event, Organization) {
    'ngInject';

    this._Event = Event;
    this._Organization = Organization;

    this.organizations = null;
    this.organizationsInProgress = false;
    // this.event = null;
    this.eventId = null;

    this.failed = false;
    this.failedDetail = null;

    this.getOrganizations();
  }

  getEvent() {
    return this._Event.get(this.eventId, 'ticket_types.discounts').then(
      (res) => {
        this.onEventChange({event: res.data});
        this.failed = false;
        this.failedDetail = null;
        return res
      }, (err) => {
        this.onEventChange({event: null});
        this.failed = true;
        this.failedDetail = err.data.detail;
        return err;
      }
    )
  }

  getOrganizations() {
    this.organizationsInProgress = true;
    return this._Organization.list('events').then(
      (res) => {
        this.organizations = res.data;
        this.organizationsInProgress = false;
        return res;
      }, (err) => {
        this.organizations = null;
        this.organizationsInProgress = false;
        return err;
      }
    )
  }
}

let eventSelectComponent = {
  controller: EventSelectCtrl,
  templateUrl: 'components/event-select.component.html',
  bindings: {
    onEventChange: '&'
  }
};

export default eventSelectComponent;
