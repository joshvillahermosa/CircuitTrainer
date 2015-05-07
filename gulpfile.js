var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var scsslint = require('gulp-scss-lint');
var sh = require('shelljs');
var argv = require('yargs').argv;
var exec = require('child_process').exec;

//Require Config File
var config = require('./gulp.config.js');

gulp.task('default', function(){console.log('Nothing set to defualt')});

/*----------------------------------------------------------------------
Build andDebug
-----------------------------------------------------------------------*/
gulp.task('run-emulator', function() {
  exec('ionic emulate android --livereload --consolelogs'); //Does not output logs
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
