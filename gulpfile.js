var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    util = require('gulp-util'),
    gettext = require('gulp-angular-gettext'),
    ngAnnotate = require('gulp-ng-annotate'),
    config = require('./config.js');

gulp.task('jshint', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('annotate', function() {
  return gulp.src(config.sourcemap.mymoney)
    .pipe(concat('app.mymoney.js'))
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('js', ['jshint', 'annotate'], function () {
  var sourcemap = config.sourcemap.vendor;
  sourcemap = sourcemap.concat([
    'dist/js/app.mymoney.js'
  ]);

  gulp.src(sourcemap)
    .pipe(concat('mymoney.js'))
    .pipe(gulp.dest('dist/js/'));
  gulp.src(sourcemap)
    .pipe(concat('mymoney.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));

  if (util.env.locale) {
    var lang = util.env.locale.split('_')[0].toLowerCase();
    var languageCode = util.env.locale.replace('_', '-');
    sourcemap = [
      'bower_components/bootstrap-calendar/js/language/' + languageCode + '.js',
      'bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.' + lang + '.js',
      'bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.' + languageCode + '.js',
      'src/locales/' + util.env.locale + '.js'
    ];
    gulp.src(sourcemap)
      .pipe(concat(util.env.locale + '.js'))
      .pipe(gulp.dest('dist/js/locales/'));
    gulp.src(sourcemap)
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

gulp.task('watch', function () {
  // Be careful, environment variable are not persistent (locale flag ignored).
  gulp.watch(['src/js/*'], ['js']);
  gulp.watch(['src/css/*'], ['css']);
  gulp.watch([
    'src/partials/**/*.html',
    'src/js/**/*.js',
  ], ['pot']);
});

gulp.task('default', ['js', 'css']);
