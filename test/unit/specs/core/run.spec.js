describe('mymoney.core.run', function() {
  var $rootScope, $location, $q, User;

  beforeEach(module('mymoney.user', 'mymoney.core'));

  beforeEach(inject(function(_$rootScope_, _$location_, _$q_, _User_) {
    $rootScope = _$rootScope_;
    $location = _$location_;
    $q = _$q_;
    User = _User_;
  }));

  describe('When route change', function() {

    it('prevent logged user to go on login page', function() {
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

      $location.path('/bankaccounts');
      $rootScope.$broadcast('$routeChangeStart', {controller: 'BankAccountListCtrl'});
      $rootScope.$apply();
      expect($location.path()).toEqual('/bankaccounts');
    });

    it('force anonymous user to go to login page', function() {
      var deferred = $q.defer();
      deferred.reject();
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      $location.path('/bankaccounts');
      $rootScope.$broadcast('$routeChangeStart', {controller: 'BankAccountListCtrl'});
      $rootScope.$apply();
      expect($location.path()).toEqual('/login');
    });

    it('does nothing if anonymous user already go to login page', function() {
      var deferred = $q.defer();
      deferred.reject();
      spyOn(User, 'get').and.returnValue({$promise: deferred.promise});

      $location.path('/login');
      $rootScope.$broadcast('$routeChangeStart', {controller: 'LoginCtrl'});
      $rootScope.$apply();
      expect($location.path()).toEqual('/login');
    });

  });
});
