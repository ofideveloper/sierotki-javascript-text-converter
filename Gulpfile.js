var gulp = require('gulp');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');

var config = {
  // Production mode is disabled when running default task (dev mode)
  PRODUCTION: true,
  // Development server port
  PORT: 8080,
  // Relative paths to sources and output directories
  SRC_DIR: 'src/',
  BUILD_DIR: 'build/',

  src: function(path) {
    return this.SRC_DIR + path;
  },
  dest: function(path) {
    return this.BUILD_DIR + path;
  }
};

process.env.NODE_ENV = 'production';

gulp.task('scripts', function() {
  var bundler = browserify({
    entries: config.src('app/main.js'),
    debug: true,
    transform: [babelify, reactify]
  });

  return bundler
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      gulpif(config.PRODUCTION, uglify())
    )
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest('js')))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('styles', function() {
  return gulp.src(config.src('styles/style.scss'), { base: '.' })
    // .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      gulpif(config.PRODUCTION, minifyCSS())
    )
    .pipe(rename('style.css'))
    // .pipe(sourcemaps.write('./'))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest(config.dest('css')))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('html', function() {
  return gulp.src(config.src('*.html'))
    .pipe(gulp.dest(config.BUILD_DIR))
    .pipe(browserSync.reload({ stream: true }));
});

/*
 * Helper task to disable production mode before running build task
 */
gulp.task('dev', function() {
  config.PRODUCTION = false;
  process.env.NODE_ENV = 'development';
});

/*
 * Start webserver and activate watchers
 */
gulp.task('server', ['build'], function() {
  browserSync({
    port: config.PORT,
    server: {
      baseDir: config.BUILD_DIR
    }
  });

  gulp.watch([config.src('app/**/*.js'), config.src('app/**/*.jsx')], ['scripts']);
  gulp.watch(config.src('styles/**/*.scss'), ['styles']);
  gulp.watch(config.src('index.html'), ['html']);
});


/*
 * Build task - production mode
 */
gulp.task('build', ['scripts', 'styles', 'html']);

/*
 * Default task - development mode
 */
gulp.task('default', ['dev', 'server']);