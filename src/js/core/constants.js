(function() {
  'use strict';

  angular
    .module('mymoney.core')
    .constant('SETTINGS', settings());

  function settings() {
    /* globals djangoSettings */
    var baseUrl = djangoSettings['static_url'] + 'mymoney/';

    return {
      XSRF_COOKIENAME: djangoSettings['xsrf_cookiename'], // jshint ignore:line
      NON_FIELD_ERRORS_KEY: djangoSettings['non_field_errors_key'], // jshint ignore:line
      DEBUG: djangoSettings['debug'],
      LOCALE: djangoSettings['locale'],
      STATIC_BASE_URL: baseUrl,
      TEMPLATES_URL: baseUrl + 'src/partials/'
    };
  }

})();
