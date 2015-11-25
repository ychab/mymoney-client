(function() {
  'use strict';

  angular.module('mymoney', [
    'mymoney.core',
    'mymoney.user'
  ]);

})();

(function() {
  'use strict';

  angular.module('mymoney.core', [
    'ngRoute',
    'ngResource',
    'gettext',
  ]);

})();

(function() {
  'use strict';

  angular
    .module('mymoney.core')
    .constant('SETTINGS', settings());

  function settings() {
    /* globals djangoSettings */
    var baseUrl = djangoSettings['static_url'] + 'mymoney/';

    return {
      XSRF_COOKIENAME: djangoSettings['xsrf_cookiename'], // jshint ignore:line
      NON_FIELD_ERRORS_KEY: djangoSettings['non_field_errors_key'], // jshint ignore:line
      DEBUG: djangoSettings['debug'],
      LOCALE: djangoSettings['locale'],
      STATIC_BASE_URL: baseUrl,
      TEMPLATES_URL: baseUrl + 'src/partials/'
    };
  }

})();

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

    // TODO - review me: split it per modules?
    $routeProvider
      .when('/home', {
        template: '',
        controller: 'HomeCtrl',
      })
      .when('/login', {
        templateUrl: SETTINGS.TEMPLATES_URL + 'login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/logout', {
        template: '',
        controller: 'LogoutCtrl',
      })
      .otherwise({
        redirectTo: '/home'
      });

    // $locationProvider.html5Mode( true ); // TODO
  }
  configure.$inject = ['$routeProvider', '$resourceProvider', '$httpProvider', '$compileProvider', '$logProvider', 'SETTINGS'];
})();

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
  appRun.$inject = ['$rootScope', '$location', 'gettextCatalog', 'SETTINGS', 'User'];
})();

(function () {
  'use strict';

  angular
    .module('mymoney.core')
    .factory('Page', Page);

  function Page() {
    var title = 'MyMoney';
    var messages = null;
    var breadcrumb = null;
    var actions = null;

    return {
      title: title,
      messages: messages,
      breacrumb: breadcrumb,
      actions: actions
    };
  }
})();

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
  MainCtrl.$inject = ['SETTINGS', 'Page', 'User'];

  function NavbarCtrl(SETTINGS) {
    var vm = this;
    vm.templates = {
      menuPrimary: SETTINGS.TEMPLATES_URL + 'menu_primary.html',
      menuUser: SETTINGS.TEMPLATES_URL + 'menu_user.html'
    };
  }
  NavbarCtrl.$inject = ['SETTINGS'];

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
  HomeCtrl.$inject = ['$location', 'User'];
})();

(function() {
  'use strict';

  angular.module('mymoney.user', [
    'mymoney.core',
  ]);

})();

(function () {
  'use strict';

  angular
    .module('mymoney.user')
    .controller('LoginCtrl', LoginCtrl)
    .controller('LogoutCtrl', LogoutCtrl);

  function LoginCtrl($location, gettextCatalog, Authentication, Page) {
    var vm = this;
    vm.authenticate = authenticate;

    Page.title = gettextCatalog.getString('Login in');

    function authenticate(username, password) {

      Authentication.login(username, password).then(function() {
        Page.messages = null;
        $location.path('/home');

      }).catch(function(response){
        Page.messages = {danger: response.data};
      });
    }
  }
  LoginCtrl.$inject = ['$location', 'gettextCatalog', 'Authentication', 'Page'];

  function LogoutCtrl($location, Authentication) {
    var mv = this;
    mv.logout = logout;

    logout();

    function logout() {
      Authentication.logout().then(function() {
        $location.path('/login');
      });
    }
  }
  LogoutCtrl.$inject = ['$location', 'Authentication'];
})();

(function () {
  'use strict';

  angular
    .module('mymoney.user')
    .factory('Users', Users)
    .factory('User', User)
    .factory('Authentication', Authentication);

  function Users($resource){
    return $resource('user/:userId', {userId:'@id'}, {
      get: {method: 'GET', params: {}}
    });
  }
  Users.$inject = ['$resource'];

  function User(Users) {
    var user = null;

    return {
      get: get,
      reset: reset,
    };

    function get() {

      if (user !== null) {
        return user;
      }

      user = Users.get(function() {
        user.bankaccounts = []; // TODO
        user.permissions = []; // TODO
      });

      return user;
    }

    function reset() {
      user = null;
    }
  }
  User.$inject = ['Users'];

  function Authentication($http, User){

    var services = {
      login: login,
      logout: logout
    };

    return services;

    function login(username, password) {
      return $http.post('/login/', {
        username: username,
        password: password
      }).then(function() {
        User.reset();
      });
    }

    function logout() {
      return $http.post('/logout/').then(function() {
        User.reset();
      });
    }
  }
  Authentication.$inject = ['$http', 'User'];
})();
