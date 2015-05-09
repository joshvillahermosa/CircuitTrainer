var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var scsslint = require('gulp-scss-lint');
var uglify = require('gulp-uglify');

var sh = require('shelljs');
var argv = require('yargs').argv;
var exec = require('child_process').exec;

//Require Config File
var config = require('./gulp.config.js');

gulp.task('default', function(){console.log('Nothing set to defualt')});

/*----------------------------------------------------------------------
Build and Debug
-----------------------------------------------------------------------*/
gulp.task('run-emulator', function() {
  exec('ionic emulate android --livereload --consolelogs'); //Does not output logs
});

gulp.task('build', function(){
  //Run JS Minifier -- Be put in JS Tmp
  //Run CSS Minifier -- Put in CSS Tmp
  //Concat JS Files -- Concat all files in JS Tmp
  //Concat CS Files -- Concat all CSS tmp
  //Disable Dev Mode -- Remove `<!-- Your App Js files-->` & `<!-- Your App CSS files-->` and files underneath
  //Enable Prod Mode -- Attach concatanated files
});

/*----------------------------------------------------------------------
Watchers
-----------------------------------------------------------------------*/
gulp.task('dev',  function() {
  //gulp.watch(config.jsFiles, ['js-lint']);
  gulp.watch(config.scssFiles, ['sass-lint']);
  gulp.watch(config.scssFiles, ['sass']);
  gulp.watch(config.jsFiles, ['js-lint']);
});


/*----------------------------------------------------------------------
Compilers
-----------------------------------------------------------------------*/
/*
gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});
*/

//SASS compilation

gulp.task('sass', function () {
  gulp.src(config.scssFiles)
    .pipe(sass().on('error', function(err){console.log(err)}))
    .pipe(gulp.dest(config.scssOutPurDir));
});

/*----------------------------------------------------------------------
Linters
-----------------------------------------------------------------------*/
gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('js-lint', function(){
  return gulp.src(config.jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass-lint', function() {
  gulp.src(config.scssFiles)
    .pipe(scsslint());
});


/*----------------------------------------------------------------------
Compressors
-----------------------------------------------------------------------*/

gulp.task('js-compress', function() {
  return gulp.src(config.jsFiles)
    .pipe(uglify())
    .pipe(gulp.dest(config.jsFilesTempOut));
});