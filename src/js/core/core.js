(function () {
  'use strict';

  angular
    .module('mymoney.core')
    .controller('MainCtrl', MainCtrl)
    .controller('NavbarCtrl', NavbarCtrl)
    .controller('HomeCtrl', HomeCtrl);

  function MainCtrl(SETTINGS, Page, User) {
    var vm = this;
    vm.page = Page;
    vm.user = User.get;
    vm.templates = {
      breadcrumb: SETTINGS.TEMPLATES_URL + 'breadcrumb.html',
      messages: SETTINGS.TEMPLATES_URL + 'messages.html',
      navbar: SETTINGS.TEMPLATES_URL + 'navbar.html'
    };
  }

  function NavbarCtrl(SETTINGS) {
    var vm = this;
    vm.templates = {
      menuPrimary: SETTINGS.TEMPLATES_URL + 'menu_primary.html',
      menuUser: SETTINGS.TEMPLATES_URL + 'menu_user.html'
    };
  }

  function HomeCtrl($location, User) {
    var vm = this;

    User.get().$promise
      .then(function(user) {
        if (user.bankaccounts.length === 1) {
          // TODO - $location.path('/bankaccounts/' + user.bankaccounts[0]['id']);
          $location.path('/home');
        } else {
          // TODO - $location.path('/bankaccounts');
          $location.path('/home');
        }
      })
      .catch(function() {
        $location.path('/login');
      });
  }
})();
