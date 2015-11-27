var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    util = require('gulp-util'),
    gettext = require('gulp-angular-gettext'),
    ngAnnotate = require('gulp-ng-annotate'),
    templateCache = require('gulp-angular-templatecache'),
    fs = require('fs'),
    config = require('./config.js');

gulp.task('jshint', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('config', function() {
  var path = ['build', 'build/js'];
  for (var i = 0; i < path.length; i++) {
    try {
      fs.statSync(path[i]);
    } catch (err) {
      fs.mkdirSync(path[i]);
    }
  }
  var content = 'var MyMoneyConfig = ' + JSON.stringify(config, null, 2) + ';\n';
  fs.writeFileSync('build/js/config.js', content);
});

gulp.task('app', ['config', 'templatecache'], function() {
  var map = ['build/js/config.js'];
  map = map.concat(config.sourcemap.mymoney);
  map = map.concat(['build/js/templates.js']);

  return gulp.src(map)
    .pipe(concat('app.js'))
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('vendor', function() {
  return gulp.src(config.sourcemap.vendor)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('js', ['jshint', 'vendor', 'app', 'translations'], function () {
  var sourcemap = [
    'build/js/vendor.js',
    'build/js/app.js'
  ];
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
      'build/js/locales/' + util.env.locale + '.js'
    ];
    gulp.src(sourcemap)
      .pipe(concat(util.env.locale + '.js'))
      .pipe(gulp.dest('build/js/locales/'));
    gulp.src(sourcemap)
      .pipe(concat(util.env.locale + '.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js/locales/'));
  }
});

gulp.task('css', function () {
  return gulp.src([
    'src/css/styles.css'
  ])
  .pipe(concat('mymoney.min.css'))
  .pipe(minifyCss())
  .pipe(gulp.dest('dist/css/'));
});

gulp.task('pot', function () {
  return gulp.src([
    'src/partials/**/*.html',
    'src/js/**/*.js'
  ])
  .pipe(gettext.extract('template.pot'))
  .pipe(gulp.dest('po/'));
});

gulp.task('translations', function () {
  return gulp.src(
    'po/**/*.po'
  )
  .pipe(gettext.compile())
  .pipe(gulp.dest('build/js/locales'));
});

gulp.task('templatecache', function () {
  return gulp.src(
    'src/partials/**/*.html'
    )
    .pipe(templateCache('templates.js', {
      module: 'mymoney.core',
      standalone: false,
      root: config.templatePath
    }))
    .pipe(gulp.dest('build/js'));
});

gulp.task('watch', function () {
  // Be careful, environment variable are not persistent (locale flag ignored).
  gulp.watch(['src/js/*/**.js'], ['js', 'pot']);
  gulp.watch(['src/css/*/**.css'], ['css']);
  gulp.watch(['src/partials/**/*.html'], ['pot', 'templatecache', 'js']);
});

gulp.task('default', ['js', 'css']);
