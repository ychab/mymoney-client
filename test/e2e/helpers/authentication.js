'use strict';

var auth = function() {

  this.login = function(username, password) {
    username = username || 'demo';
    password = password || 'demo';

    browser.get('#/login');
    element(by.model('username')).sendKeys(username);
    element(by.model('password')).sendKeys(password);
    element(by.tagName('form')).submit();
  };

  this.logout = function() {
    browser.get('#/logout');
  };
};

module.exports = auth;
