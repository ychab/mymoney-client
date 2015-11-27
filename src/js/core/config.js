(function() {
  'use strict';

  angular
    .module('mymoney.core')
    .config(configure);

  function configure($routeProvider, $resourceProvider, $httpProvider,
                     $compileProvider, $logProvider, SETTINGS) {

    // This is were magic happen : read CSRF token from cookie and send it with
    // HTTP header (instead of hidden input).
    $httpProvider.defaults.xsrfCookieName = SETTINGS.XSRF_COOKIENAME;
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $compileProvider.debugInfoEnabled(SETTINGS.DEBUG);
    $logProvider.debugEnabled(SETTINGS.DEBUG);

    // Our endpoints URI need trailing slash, don't remove them.
    $resourceProvider.defaults.stripTrailingSlashes = false;

    $routeProvider
      .when('/home', {
        template: '',
        controller: 'HomeCtrl'
      })
      .when('/login', {
        templateUrl: SETTINGS.TEMPLATES_URL + 'login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/logout', {
        template: '',
        controller: 'LogoutCtrl'
      })
      // Bank accounts
      .when('/bankaccounts/list', {
        templateUrl: SETTINGS.TEMPLATES_URL + 'bankaccounts/list.html',
        controller: 'BankAccountListCtrl',
        controllerAs: 'bankAccountList'
      })
      .when('/bankaccounts/add', {
        templateUrl: SETTINGS.TEMPLATES_URL + 'bankaccounts/create.html',
        controller: 'BankAccountCreateCtrl',
        controllerAs: 'bankAccountCreate'
      })
      .when('/bankaccounts/:bankaccountId', {
        templateUrl: SETTINGS.TEMPLATES_URL + 'bankaccounts/detail.html',
        controller: 'BankAccountDetailCtrl',
        controllerAs: 'bankAccountDetail'
      })
      .otherwise({
        redirectTo: '/home'
      });
  }
})();
