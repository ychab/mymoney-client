module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-gettext/dist/angular-gettext.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/jquery/jquery.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/underscore/underscore.js',
      'bower_components/moment/moment.js',
      'bower_components/bootstrap-calendar/js/calendar.js',
      'bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
      'bower_components/chartjs/Chart.js',
      'test/unit/mock/*.js',
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
      'src/js/**/*.js',  // TODO - just in case we forgot some of them
      'test/unit/specs/**/*.spec.js'
    ],

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
