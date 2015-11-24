var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    util = require('gulp-util'),
    gettext = require('gulp-angular-gettext'),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('jshint', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('annotate', function() {
  return gulp.src([
      'src/js/**/*.js',  // TODO - explicit filename and order
    ])
    .pipe(concat('app.mymoney.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('js', ['jshint', 'annotate'], function () {
  var map = [
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
    'bower_components/chartjs/Chart.js',
    // "dist/js/src.mymoney.js", TODO - exclude it for dev now
  ];
  gulp.src(map)
    .pipe(concat('mymoney.js'))
    .pipe(gulp.dest('dist/js/'));
  gulp.src(map)
    .pipe(concat('mymoney.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));

  if (util.env.locale) {
    var lang = util.env.locale.split('_')[0].toLowerCase();
    var languageCode = util.env.locale.replace('_', '-');
    map = [
      'bower_components/bootstrap-calendar/js/language/' + languageCode + '.js',
      'bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.' + lang + '.js',
      'bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.' + languageCode + '.js',
      'src/locales/" + util.env.locale + ".js'
    ];
    gulp.src(map)
      .pipe(concat(util.env.locale + '.js'))
      .pipe(gulp.dest('dist/js/locales/'));
    gulp.src(map)
      .pipe(concat(util.env.locale + '.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js/locales/'));
  }
});

gulp.task('css', function () {
  return gulp.src([
    'src/css/styles.css',
  ])
  .pipe(concat('mymoney.min.css'))
  .pipe(minifyCss())
  .pipe(gulp.dest('dist/css/'));
});

gulp.task('watch', function () {
  // FIXME - environment variables are not persistent.
  gulp.watch(['src/js/*'], ['js']);
  gulp.watch(['src/css/*'], ['css']);
});

gulp.task('pot', function () {
  return gulp.src([
    'src/partials/**/*.html',
    'src/js/**/*.js',
  ])
  .pipe(gettext.extract('template.pot'))
  .pipe(gulp.dest('po/'));
});

gulp.task('translations', function () {
  return gulp.src(
    'po/**/*.po'
  )
  .pipe(gettext.compile())
  .pipe(gulp.dest('src/locales/'));
});

gulp.task('default', ['js', 'css']);
