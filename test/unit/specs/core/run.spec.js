describe('mymoney.core.run', function() {
  var $rootScope, $location, $q, User, Page;

  beforeEach(module('mymoney.user', 'mymoney.core'));

  beforeEach(inject(function(_$rootScope_, _$location_, _$q_, _User_, _Page_) {
    $rootScope = _$rootScope_;
    $location = _$location_;
    $q = _$q_;
    User = _User_;
    Page = _Page_;
  }));

  describe('When route change', function() {

    xit('prevent logged user to go on login page', function() {
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      $location.path('/login');
      $rootScope.$broadcast('$routeChangeStart', {controller: 'LoginCtrl'});
      $rootScope.$apply();
      expect($location.path()).toEqual('/home');
    });

    xit('do nothing if user is logged and next page is not log in page', function() {
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      $location.path('/bankaccounts/list');
      $rootScope.$broadcast('$routeChangeStart', {controller: 'BankAccountListCtrl'});
      $rootScope.$apply();
      expect($location.path()).toEqual('/bankaccounts/list');
    });

    xit('force anonymous user to go to login page', function() {
      var deferred = $q.defer();
      deferred.reject();
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      $location.path('/bankaccounts/list');
      $rootScope.$broadcast('$routeChangeStart', {controller: 'BankAccountListCtrl'});
      $rootScope.$apply();
      expect($location.path()).toEqual('/login');
    });

    xit('does nothing if anonymous user already go to login page', function() {
      var deferred = $q.defer();
      deferred.reject();
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      $location.path('/login');
      $rootScope.$broadcast('$routeChangeStart', {controller: 'LoginCtrl'});
      $rootScope.$apply();
      expect($location.path()).toEqual('/login');
    });

    xit('do nothing if current user has permission', function() {
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});
      Page.checkAccess = function(u, c) { return true;};

      $location.path('/bankaccounts/list');
      $rootScope.$broadcast('$routeChangeStart', {controller: 'BankAccountListCtrl'});
      $rootScope.$apply();
      expect($location.path()).toEqual('/bankaccounts/list');
    });

    xit('block access if current user has not permission', function() {
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});
      Page.checkAccess = function(u, c) { return false;};

      $location.path('/bankaccounts/list');
      $rootScope.$broadcast('$routeChangeStart', {controller: 'BankAccountListCtrl'});
      $rootScope.$apply();
      expect(Page.messages.all.length).toEqual(1);
      expect($location.path()).not.toEqual('/bankaccounts/list');
    });
  });
});
