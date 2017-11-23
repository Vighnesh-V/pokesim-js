var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var resolutions = require('browserify-resolutions');
var babel = require('gulp-babel');
var es = require('event-stream');
var path = require('path');

gulp.task('browserify', function () {
  var bundler = browserify({
    entries: ['./views/public/main.jsx'],
    extensions: ['.jsx', '.js'],
    paths: ['./node_modules','./views'],
    debug: true,
    // Required properties for watchify
    cache: {}, packageCache: {}, fullPaths: true
  })
  .transform('babelify', {
    presets: ['babel-preset-env', 'react'] 
  })
  .plugin(resolutions, '*')
    .on('time', function (time) {
      console.log('Bundle updated in ' + (time / 1000) + 's.');
    });

  var watcher = watchify(bundler);

  var bundle = function () {
    watcher
      .bundle()
      .on('error', function (err) {
        console.log(err.toString());
      })
      .pipe(source('main.js'))
      .pipe(gulp.dest('./views/public/build/'));
  };
  bundle();
  return watcher.on('update', function (filenames) {
    filenames.forEach(function (filename) {
      console.log(path.relative(__dirname, filename) + ' changed.');
    });
    bundle();
  });
});

gulp.task('default', ['browserify']);

// var COMPILE_FILES = [
//   'views/public/*.jsx',
//   'views/public/actions/*.js',
//   'views/public/reducers/*.js',
//   'public/main.jsx',
//   'public/*.js',
// ];


// gulp.task('js-compile', function () {
//   return gulp.src(COMPILE_FILES, {base: 'views'})
//     .pipe(babel({
//       presets: ['es2015', 'react']
//     }))
//     .pipe(gulp.dest('compiled'));
// });



// //gulp.task('compile', ['js-compile']);