module.exports = function(config) {
  config.set({
    backendPath: '<MY_RELATIVE_PATH_WITHOUT_TRAILING_SLASH>',
    templatePath: '/static/mymoney/src/partials/',
    debug: false,
    locale: 'en_US'
  });
};
