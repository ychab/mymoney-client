(function() {
  'use strict';

  angular
    .module('mymoney.core')
    .constant('SETTINGS', settings());

  function settings() {
    return {
      XSRF_COOKIENAME: MyMoneyConfig['XSRFCookieName'],
      NON_FIELD_ERRORS_KEY: MyMoneyConfig['nonFieldErrorsKey'],
      DEBUG: MyMoneyConfig['debug'],
      LOCALE: MyMoneyConfig['locale'],
      TEMPLATES_URL: MyMoneyConfig['templatePath']
    };
  }

})();
