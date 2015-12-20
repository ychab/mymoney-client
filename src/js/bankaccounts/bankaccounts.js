(function () {
  'use strict';

  angular
    .module('mymoney.bankaccounts')
    .controller('BankAccountListCtrl', BankAccountListCtrl)
    .controller('BankAccountCreateCtrl', BankAccountCreateCtrl)
    .controller('BankAccountDetailCtrl', BankAccountDetailCtrl);

  function BankAccountListCtrl(gettext, Page, User) {
    var vm = this;
    Page.setTitle(gettext('Bank accounts'));

    User.get().$promise.then(function(user) {
      if (user.hasPermission('add_bankaccount')) {
        Page.actions = [{
          text: gettext('Add'),
          path: '/bankaccounts/add'
        }];
      }
    });
  }

  function BankAccountCreateCtrl($location, gettext, Page, BankAccounts) {
    var vm = this;
    vm.bankaccount = null;
    vm.create = create;

    Page.setTitle(gettext('Create a new bank account'));

    function create() {
      BankAccounts.save(vm.bankaccount, function(bankaccount) {
        Page.addMessage(
          gettext('The bank account has been created successfully.'),
          'success'
        );
        $location.path('/bankaccounts/' + bankaccount.id);
      }, function(response) {
        Page.addMessages(response.data, 'danger');
      });
    }
  }

  function BankAccountDetailCtrl() {
    var mv = this;
  }
})();
