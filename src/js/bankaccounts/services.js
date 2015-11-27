(function () {
  'use strict';

  angular
    .module('mymoney.bankaccounts')
    .factory('BankAccounts', BankAccounts);

  function BankAccounts($resource){
    return $resource('bank-accounts/:bankaccountId/', {bankaccountId:'@id'});
  }

})();
