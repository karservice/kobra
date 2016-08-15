class SearchBarCtrl {
  constructor($timeout, $window, Student) {
    'ngInject';

    this._$timeout = $timeout;
    this._$window = $window;
    this._Student = Student;

    this.form = null;

    this.event = null;

    this.student = null;
    this.failed = false;
    this.failureDetail = null;
    this.inProgress = false;
    this.query = '';
  }

  focusSearchField() {
    this._$timeout(() => {
      let element = this._$window.document.getElementById('liuOrMifareId');
      if (element) {
        element.focus();
      }
    });
  }

  setEvent(event) {
    this.event = event;
    // The blur event triggering the refocus is not fired at this point, so we
    // must focus the field manually here.
    this.focusSearchField()
  }

  search() {
    if (this.form.$valid) {
      this.inProgress = true;
      return this._Student.get(this.query, 'section,union').then(
        (res) => {
          console.log(res);
          this.student = res.data;
          this.failed = false;
          this.failureDetail = null;
          this.inProgress = false;
          this.query = '';
          return res;
        }, (err) => {
          console.error(err);
          this.student = null;
          this.failed = true;
          this.failureDetail = err.data.detail;
          this.inProgress = false;
          this.query = '';
          return err;
        }
      )
    }
  }
}

let searchBarComponent = {
  controller: SearchBarCtrl,
  templateUrl: 'components/search-bar.component.html'
};

export default searchBarComponent;
