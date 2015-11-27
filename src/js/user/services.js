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

  function User(Users) {
    var user = null;

    return {
      get: get,
      reset: reset
    };

    function get() {
      if (user !== null) {
        return user;
      }

      user = Users.get(function() {
        user.hasPermission = function(permission) {
          return user.permissions.indexOf(permission) !== -1;
        };
      });

      return user;
    }

    function reset() {
      user = null;
    }
  }

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
})();
