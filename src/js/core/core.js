(function () {
  'use strict';

  angular
    .module('mymoney.core')
    .controller('MainCtrl', MainCtrl)
    .controller('NavbarCtrl', NavbarCtrl)
    .controller('HomeCtrl', HomeCtrl);

  function MainCtrl($log, SETTINGS, Config, Page, User) {
    var vm = this;
    vm.config = Config;
    vm.page = Page;
    vm.user = User.get;
    vm.templates = {
      breadcrumb: SETTINGS.TEMPLATES_URL + 'breadcrumb.html',
      menuActions: SETTINGS.TEMPLATES_URL + 'menu_actions.html',
      menuTabs: SETTINGS.TEMPLATES_URL + 'menu_tabs.html',
      menuItems: SETTINGS.TEMPLATES_URL + 'menu_items.html',
      messages: SETTINGS.TEMPLATES_URL + 'messages.html',
      navbar: SETTINGS.TEMPLATES_URL + 'navbar.html'
    };
    vm.$log = $log;
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
          $location.path('/bankaccounts/' + user.bankaccounts[0]['id']);
        } else {
          $location.path('/bankaccounts/list');
        }
      })
      .catch(function() {
        $location.path('/login');
      });
  }
})();
