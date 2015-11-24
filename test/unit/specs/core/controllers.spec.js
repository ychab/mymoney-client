describe('mymoney.core.controllers', function() {
  var $controller, settings, User;

  // Soft circular dependencies. In fact, user module must be parts
  // of the core itself...
  beforeEach(module('mymoney.user', 'mymoney.core'));

  beforeEach(inject(function(_$controller_, _SETTINGS_, _User_) {
    $controller = _$controller_;
    settings = _SETTINGS_;
    User = _User_;
  }));

  describe('MainCtrl', function() {
    var Page;

    beforeEach(inject(function(_Page_) {
      Page = _Page_;
    }));

    function createController() {
      return $controller('MainCtrl', {
        SETTINGS: settings,
        Page: Page,
        User: User
      });
    }

    it('should set template paths', function() {
      settings.TEMPLATES_URL = 'test-static/';
      var controller = createController();
      expect(controller.templates.breadcrumb).toEqual('test-static/breadcrumb.html');
      expect(controller.templates.messages).toEqual('test-static/messages.html');
      expect(controller.templates.navbar).toEqual('test-static/navbar.html');
    });

    it('should set current user', function() {
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

    it('should set template paths', function() {
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

    it('should redirect logged user on the single bank account page', function() {
      var deferred = $q.defer();
      deferred.resolve({bankaccounts: [{id: 1}]});
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      var controller = createController();
      $rootScope.$apply();
      expect($location.path()).toEqual('/bankaccounts/1');
    });

    it('should redirect logged user on bank accounts list page', function() {
      var deferred = $q.defer();
      deferred.resolve({bankaccounts: [{id: 1}, {id: 2}]});
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      var controller = createController();
      $rootScope.$apply();
      expect($location.path()).toEqual('/bankaccounts');
    });

    it('should redirect anonymous user on log in page', function() {
      var deferred = $q.defer();
      deferred.reject();
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      var controller = createController();
      $rootScope.$apply();
      expect($location.path()).toEqual('/login');
    });

  });
});
