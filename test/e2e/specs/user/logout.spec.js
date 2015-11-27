var Authentication = require('../../helpers/authentication.js');

describe('Logout', function() {
  var auth;

  beforeEach(function() {
    auth = new Authentication();
    auth.logout();
  });

  it('redirect user on login page after being logout', function() {
    auth.login();
    auth.logout();
    var url = browser.getLocationAbsUrl();
    expect(url).toMatch(/login$/);
  });

});
