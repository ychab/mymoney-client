(function () {
  'use strict';

  angular
    .module('mymoney.user')
    .controller('LoginCtrl', LoginCtrl)
    .controller('LogoutCtrl', LogoutCtrl);

  function LoginCtrl($location, gettext, Authentication, Page) {
    var vm = this;
    vm.authenticate = authenticate;
    Page.setTitle(gettext('Log in'));

    function authenticate(username, password) {

      Authentication.login(username, password).then(function() {
        $location.path('/home');

      }).catch(function(response){
        Page.addMessages(response.data, 'danger');
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
