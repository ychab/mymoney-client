var Authentication = require('../../helpers/authentication.js');

describe('Login', function() {
  var auth;

  beforeEach(function() {
    auth = new Authentication();
    auth.logout();
  });

  it('redirect anonymous on login page', function() {
    browser.get('#/bankaccounts');
    var url = browser.getLocationAbsUrl();
    expect(url).toMatch(/login$/);
  });

  it('display error message on login failure', function() {
    var messages = element.all(by.repeater('(type, messages) in main.page.messages'));

    browser.get('#/login');
    element(by.model('username')).sendKeys('foo');
    element(by.model('password')).sendKeys('bar');
    element(by.tagName('form')).submit();

    expect(messages.count()).toEqual(1);
  });

  it('display menu primary on login success', function() {
    var menuPrimary = element(by.id('menu_primary'));
    expect(menuPrimary.isDisplayed()).toBeFalsy();
    auth.login();
    expect(menuPrimary.isDisplayed()).toBeTruthy();
  });

  it('display menu user on login success', function() {
    var menuUser = element(by.id('menu_user'));
    expect(menuUser.isDisplayed()).toBeFalsy();
    auth.login();
    expect(menuUser.isDisplayed()).toBeTruthy();
  });

  xit('redirect user on bank account page if there is only one bank account', function() {
    // TODO
  });

  xit('redirect user on bank account list page if there is more than one bank account', function() {
    // TODO
  });

});
