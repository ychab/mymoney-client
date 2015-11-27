describe('mymoney.user.services', function() {
  var $resource, $httpBackend, User;

  beforeEach(module('mymoney.user'));

  beforeEach(inject(function(_$httpBackend_, _User_) {
    $httpBackend = _$httpBackend_;
    User = _User_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('User', function() {
    var Users;

    beforeEach(inject(function(_Users_) {
      Users = _Users_;
      spyOn(Users, 'get');
    }));

    xit('should return a singleton user promise', function() {
      User.get();
      expect(Users.get.calls.count()).toEqual(1);
      User.get();
      expect(Users.get.calls.count()).toEqual(1);
    });

    xit('should reset the current user', function() {
      User.get();
      expect(Users.get.calls.count()).toEqual(1);
      User.reset();
      User.get();
      expect(Users.get.calls.count()).toEqual(2);
    });
  });

  describe('Authentication', function() {
    var service;

    beforeEach(inject(function(Authentication) {
      service = Authentication;
      spyOn(User, 'reset');
    }));

    xit('should reset previous user on log in', function() {
      $httpBackend.whenPOST('/login/').respond(200);
      service.login('foo', 'bar');
      $httpBackend.flush();
      expect(User.reset).toHaveBeenCalled();
    });

    xit('should do nothing on log in failure', function() {
      $httpBackend.whenPOST('/login/').respond(400);
      service.login('foo', 'bar');
      $httpBackend.flush();
      expect(User.reset).not.toHaveBeenCalled();
    });

    xit('should reset previous user on log out', function() {
      $httpBackend.whenPOST('/logout/').respond(200);
      service.logout();
      $httpBackend.flush();
      expect(User.reset).toHaveBeenCalled();
    });

    xit('should do nothing on log out failure', function() {
      $httpBackend.whenPOST('/logout/').respond(400);
      service.logout();
      $httpBackend.flush();
      expect(User.reset).not.toHaveBeenCalled();
    });

  });
});
