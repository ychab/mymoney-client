describe('mymoney.user.controllers', function() {
  var $controller, $rootScope, $location, Authentication, $q;

  beforeEach(module('mymoney.user'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$location_,
                             _Authentication_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    Authentication = _Authentication_;
    $q = _$q_;
  }));

  describe('LoginCtrl', function() {
    var gettextCatalog, Page;

    beforeEach(inject(function(_gettextCatalog_, _Page_) {
      gettextCatalog = _gettextCatalog_;
      Page = _Page_;
    }));

    function createController(resolve, response) {

      var deferred = $q.defer();
      if (resolve) {
        deferred.resolve(response);
      } else {
        deferred.reject(response);
      }
      spyOn(Authentication, 'login').and.returnValue(deferred.promise);

      return $controller('LoginCtrl', {
        $location: $location,
        gettextCatalog: gettextCatalog,
        Authentication: Authentication,
        Page: Page
      });
    }

    it('should set page title', function() {
      gettextCatalog.getString = function(str){return str;};
      var controller = createController();
      expect(Page.title).toEqual('Login in');
    });

    it('should set errors messages when login failed', function() {
      var errors = {username: ['Unknown username']};
      var response = {data: errors};
      var controller = createController(false, response);
      controller.authenticate('foo', 'bar');
      $rootScope.$apply();

      expect(Page.messages).toEqual({danger: errors});
      expect($location.path()).toEqual('');
    });

    it('should clear previous errors messages on success', function() {
      Page.messages = {danger: {username: ['Unknown username']}};

      var controller = createController(true);
      controller.authenticate('foo', 'bar');
      $rootScope.$apply();

      expect(Page.messages).toBeNull();
    });

    it('should redirect user on success', function() {
      var controller = createController(true);
      controller.authenticate('foo', 'bar');
      $rootScope.$apply();
      expect($location.path()).toEqual('/home');
    });
  });

  describe('LogoutCtrl', function() {

    function createController(resolve) {

      var deferred = $q.defer();
      if (resolve) {
        deferred.resolve();
      } else {
        deferred.reject();
      }
      spyOn(Authentication, 'logout').and.returnValue(deferred.promise);

      return $controller('LogoutCtrl', {
        $location: $location,
        Authentication: Authentication
      });
    }

    it('should do nothing if logout failed', function() {
      var controller = createController(false);
      $rootScope.$apply();
      expect($location.path()).toEqual('');
    });

    it('redirect user on login page when successfully logged out', function() {
      var controller = createController(true);
      $rootScope.$apply();
      expect($location.path()).toEqual('/login');
    });

  });
});
