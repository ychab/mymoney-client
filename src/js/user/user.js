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
})();
