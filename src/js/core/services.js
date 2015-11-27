(function () {
  'use strict';

  angular
    .module('mymoney.core')
    .factory('Page', Page)
    .factory('Config', Config);

  function Page(gettext) {
    var page = {
      title: 'MyMoney',
      messages: null,
      breadcrumb: null,
      actions: null,
      tabs: null,
      items: null,
      setTitle: setTitle,
      setMenuTabLinks: setMenuTabLinks,
      setMenuItemLinks: setMenuItemLinks,
      checkAccess: checkAccess,
      addMessage: addMessage,
      addMessages: addMessages,
      reset: reset
    };

    return page;

    function setTitle(title) {
      page.title = title;
    }

    function setMenuTabLinks(bankaccount, current, user) {
      page.tabs = {
        'detail': {
          path: '/bankaccounts/' + bankaccount.id,
          text: gettext('See'),
          glyphicon: 'eye-open',
          active: false
        }
      };
      if (user.permissions.indexOf('change_bankaccount') !== -1) {
        angular.extend(page.tabs, {
          'edit': {
            path: '/bankaccounts/' + bankaccount.id + '/update',
            text: gettext('Edit'),
            glyphicon: 'edit',
            active: false
          }
        });
      }
      angular.extend(page.tabs, {
        'scheduler': {
          path: '/bankaccounts/' + bankaccount.id + '/scheduler',
          text: gettext('Schedule'),
          glyphicon: 'time',
          active: false
        },
        'analytics': {
          path: '/bankaccounts/' + bankaccount.id + '/analytics',
          text: gettext('Statistics'),
          glyphicon: 'stats',
          active: false
        }
      });
      page.tabs[current].active = true;
    }

    function setMenuItemLinks(bankaccount, current) {
      page.items = {
        table: {
          path: '/bankaccounts/' + bankaccount.id,
          text: gettext('Table view'),
          active: false
        },
        edit: {
          path: '/bankaccounts/' + bankaccount.id + '/calendar',
          text: gettext('Calendar view'),
          active: false
        }
      };
      page.items[current].active = true;
    }

    function checkAccess(user, nextController) {
      angular.forEach(permissionsPathMapping, function(controller, permission) {
        if (controller === nextController) {
          return user.hasPermission(permission);
        }
      });
      return true;
    }

    function addMessage(message, type) {
      addMessages({all: [message]}, type || 'danger');
    }

    function addMessages(messages, type) {
      page.messages = {};
      page.messages[type] = messages;
    }

    function reset() {
      page.title = 'MyMoney';
      page.messages = null;
      page.breadcrumb = null;
      page.actions = null;
      page.tabs = null;
      page.items = null;
    }

    var permissionsPathMapping = {
      'BankAccountCreateCtrl': 'add_bankaccount'
    };
  }

  function Config($http) {
    var conf = {
      currencies: [],
      refresh: refresh
    };
    return conf;

    function refresh() {
      $http.get('/config').then(function(response) {
        conf.currencies = [];

        angular.forEach(response.data.currencies, function(label, value) {
          conf.currencies.push({
            code: value,
            label: label
          });
        });
        conf.currencies.sort(function(a, b) {
          return a.label < b.label ? -1 : 1;
        });
      });
    }
  }
})();
