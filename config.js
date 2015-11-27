'use strict';

var Config = function () {
  var config = this;

  this.set = function (newConfig) {
    Object.keys(newConfig).forEach(function (key) {
      config[key] = newConfig[key];
    });
  };

  // DEFAULT CONFIG
  this.sourcemap = {
    vendor: [
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-gettext/dist/angular-gettext.js',
        'bower_components/jquery/jquery.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/underscore/underscore.js',
        'bower_components/moment/moment.js',
        'bower_components/bootstrap-calendar/js/calendar.js',
        'bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
        'bower_components/chartjs/Chart.js'
    ],
    mymoney: [
        'src/js/app.module.js',
        'src/js/core/core.module.js',
        'src/js/core/constants.js',
        'src/js/core/config.js',
        'src/js/core/run.js',
        'src/js/core/services.js',
        'src/js/core/core.js',
        'src/js/user/user.module.js',
        'src/js/user/user.js',
        'src/js/user/services.js',
        'src/js/bankaccounts/bankaccounts.module.js',
        'src/js/bankaccounts/services.js',
        'src/js/bankaccounts/bankaccounts.js'
    ]
  };
  this.XSRFCookieName = 'csrftoken';
  this.nonFieldErrorsKey = 'non_field_errors';

  // Should be overriden.
  this.backendPath = '../mymoney-server';
  this.templatePath = '/static/mymoney/src/partials/';
  this.debug = false;
  this.locale = 'en_US';
};

var config = new Config();

try {
  var configModule = require('./mymoney.config.js');
  configModule(config);
} catch (e) {}

module.exports = config;
