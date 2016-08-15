class HamburgerMenu {
  constructor() {
    'ngInject';

    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}

class MainNavCtrl {
  constructor() {
    'ngInject';

    this.hamburgerMenu = new HamburgerMenu();
  }
}

let mainNavComponent = {
  controller: MainNavCtrl,
  templateUrl: 'components/main-nav.component.html'
};

export default mainNavComponent;
