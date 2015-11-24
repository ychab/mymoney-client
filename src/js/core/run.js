(function() {
  'use strict';

  angular
    .module('mymoney.core')
    .run(appRun);

  function appRun($rootScope, $location, gettextCatalog, SETTINGS, User) {

    // Configure instance, not provider...
    gettextCatalog.setCurrentLanguage(SETTINGS.LOCALE);
    gettextCatalog.debug = SETTINGS.DEBUG;

    var user = User;

    $rootScope.$on('$routeChangeStart', function(event, next, current) {

      user.get().$promise
        .then(function() {
          // Prevent authenticated user to go to the login page.
          if (next.controller === 'LoginCtrl') {
            $location.path('/home');
          }
        })
        .catch(function() {
          // Force anonymous to be redirect on the login page.
          if (next.controller !== 'LoginCtrl') {
            $location.path('/login');
          }
        });
    });
  }
})();
