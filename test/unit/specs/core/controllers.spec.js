describe('mymoney.core.controllers', function() {
  var $controller, $log, settings, User, Config;

  // Soft circular dependencies. In fact, user module must be parts
  // of the core itself...
  beforeEach(module('mymoney.user', 'mymoney.core'));

  beforeEach(inject(function(_$controller_, _$log_, _SETTINGS_, _User_, _Config_) {
    $controller = _$controller_;
    $log = _$log_;
    settings = _SETTINGS_;
    Config = _Config_;
    User = _User_;
  }));

  describe('MainCtrl', function() {
    var Page;

    beforeEach(inject(function(_Page_) {
      Page = _Page_;
    }));

    function createController() {
      return $controller('MainCtrl', {
        $log: $log,
        SETTINGS: settings,
        Config: Config,
        Page: Page,
        User: User
      });
    }

    xit('should set template paths', function() {
      settings.TEMPLATES_URL = 'test-static/';
      var controller = createController();
      expect(controller.templates.breadcrumb).toEqual('test-static/breadcrumb.html');
      expect(controller.templates.messages).toEqual('test-static/messages.html');
      expect(controller.templates.navbar).toEqual('test-static/navbar.html');
    });

    xit('should set current user', function() {
      spyOn(User, 'get');
      var controller = createController();
      controller.user();
      expect(User.get).toHaveBeenCalled();
    });
  });

  describe('NavbarCtrl', function() {

    function createController() {
      return $controller('NavbarCtrl', {
        SETTINGS: settings
      });
    }

    xit('should set template paths', function() {
      settings.TEMPLATES_URL = 'test-static/';
      var controller = createController();
      expect(controller.templates.menuPrimary).toEqual('test-static/menu_primary.html');
      expect(controller.templates.menuUser).toEqual('test-static/menu_user.html');
    });

  });

  describe('HomeCtrl', function() {
    var $location, $rootScope, $q;

    beforeEach(inject(function(_$location_, _$rootScope_, _$q_) {
      $location = _$location_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    function createController() {
      return $controller('HomeCtrl', {
        $location: $location,
        User: User
      });
    }

    xit('should redirect logged usesettingsr on the single bank account page', function() {
      var deferred = $q.defer();
      deferred.resolve({bankaccounts: [{id: 1}]});
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      var controller = createController();
      $rootScope.$apply();
      expect($location.path()).toEqual('/bankaccounts/1');
    });

    xit('should redirect logged user on bank accounts list page', function() {
      var deferred = $q.defer();
      deferred.resolve({bankaccounts: [{id: 1}, {id: 2}]});
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      var controller = createController();
      $rootScope.$apply();
      expect($location.path()).toEqual('/bankaccounts');
    });

    xit('should redirect anonymous user on log in page', function() {
      var deferred = $q.defer();
      deferred.reject();
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      var controller = createController();
      $rootScope.$apply();
      expect($location.path()).toEqual('/login');
    });

  });
});
