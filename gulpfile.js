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
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');

var runSequence = require('run-sequence')
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

gulp.task('js-build', function(){
  runSequence('js-concat', 'js-compress');
  console.log('Minified and concatenated');
});

/*----------------------------------------------------------------------
Watchers
-----------------------------------------------------------------------*/
gulp.task('dev',  function() {
  //gulp.watch(config.jsFiles, ['js-lint']);
  gulp.watch(config.scssFiles, ['sass-lint']);
  gulp.watch(config.scssFiles, ['sass']);
  gulp.watch(config.jsFiles+'/*', ['js-hint']);
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

gulp.task('js-hint', function(){
  return gulp.src(config.jsFiles+'/*')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass-lint', function() {
  gulp.src(config.scssFiles)
    .pipe(scsslint());
});

gulp.task('ng-min', function(){
  return gulp.src(config.jsFiles+'*')
    .pipe(ngAnnotate())
    .pipe(gulp.dest(config.jsFiles));
});

/*----------------------------------------------------------------------
Compressors
-----------------------------------------------------------------------*/

gulp.task('js-compress', function() {
  console.log('Minifying JS Files');
  return gulp.src(config.jsFilesOut+'/*')
    .pipe(uglify({sequences: false}))
    .pipe(gulp.dest(config.jsFiles));
});

gulp.task('css-compress', function(){
  console.log('Minifying CSS');
  return gulp.src(config.scssOutPurDir+'/*.app.css')
    .pipe(minifyCss({compatibility: 'ie9'}))
    .pipe(gulp.dest(config.scssOutPurDir));
});

/*----------------------------------------------------------------------
Concatenators & HTML Injectio
-----------------------------------------------------------------------*/

gulp.task('js-concat', function() {
  console.log('Concatenating JS Files');
  return gulp.src(config.jsFiles+'/*')
    .pipe(concat('main.min.js', {newLine: ';'}))
    .pipe(gulp.dest(config.jsFilesOut));
});