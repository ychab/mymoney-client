var config = require('../config.js');

var sourcemap = config.sourcemap.vendor;
sourcemap = sourcemap.concat([
  'bower_components/angular-mocks/angular-mocks.js',
  'test/unit/mock/*.js'
]);
sourcemap = sourcemap.concat(config.sourcemap.mymoney);
sourcemap = sourcemap.concat('test/unit/specs/**/*.spec.js');

module.exports = function(config){
  config.set({

    basePath : '../',

    files : sourcemap,

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/**/*.js': ['coverage']
    },
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/'
    }

  });
};
