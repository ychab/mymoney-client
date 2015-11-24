exports.config = {

  specs: [
    'e2e/specs/**/*.js'
  ],

  framework: 'jasmine2',

  capabilities: {
    browserName: 'chrome'
  },

  baseUrl: 'http://localhost:8000/',

  suites: {
    user: 'e2e/specs/user/**/*.spec.js'
  },

  onPrepare: 'e2e/environment/prepare.js'
};
