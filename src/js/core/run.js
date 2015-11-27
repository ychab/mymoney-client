(function() {
  'use strict';

  angular
    .module('mymoney.core')
    .run(appRun);

  function appRun($rootScope, $location, gettextCatalog, gettext, SETTINGS,
                  Config, User, Page) {

    // Configure instance, not provider...
    gettextCatalog.setCurrentLanguage(SETTINGS.LOCALE);
    gettextCatalog.debug = SETTINGS.DEBUG;

    Config.refresh();

    // Why children scope .$on can't access it directly?
    var t = gettext;
    var user = User;
    var page = Page;

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      page.reset();

      user.get().$promise
        .then(function(user) {

          // Prevent authenticated user to go to the login page.
          if (next.controller === 'LoginCtrl') {
            $location.path('/home');
          }

          // Page check access.
          if (!page.checkAccess(user, next.controller)) {
            page.addMessage(
              t('You are not allowed to access this page.'),
              'danger'
            );
            event.preventDefault();
            return;
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
