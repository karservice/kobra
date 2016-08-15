// This is the fine state of dependency handling and asset pipelining in the
// year 2016. Ugh.

var autoprefixer = require('gulp-autoprefixer')
var browserify = require('browserify')
var cleanCss = require('gulp-clean-css')
var concat = require('gulp-concat')
var del = require('del')
var exorcist = require('exorcist')
var gulp = require('gulp')
var mkdirp = require('mkdirp')
var notify = require('gulp-notify')
var rename = require('gulp-rename')
var sass = require('gulp-sass')
var sequence = require('run-sequence')
var sourcemaps = require('gulp-sourcemaps')
var vinylSource = require('vinyl-source-stream')
var watchify = require('watchify')


var isProduction = (process.env.NODE_ENV === 'production')

var paths = {
  build: {
    base: 'web-build',
    html: 'web-build',
    readme: 'web-build/README.md',
    css: 'web-build/assets/css',
    fonts: 'web-build/assets/fonts',
    js: 'web-build/assets/js',
    jsBundle: 'web-build/assets/js/kobra.js'
  },
  fonts: [
    'node_modules/font-awesome/fonts/fontawesome-webfont.*'
  ],
  html: [
    'web-src/kobra/index.html'
  ],
  scss: 'web-src/assets/scss/kobra.scss',
  scssPaths: [
    'web-src/assets/scss',  // This entry must be first!
    'node_modules/bootstrap-sass/assets/stylesheets',
    'node_modules/bootswatch',
    'node_modules/font-awesome/scss'
  ],
  jsEntryPoint: 'web-src/kobra/index.js',
  js: [
    'web-src/kobra/**/*.js'
  ]
}

var buildJs = function (watch) {
  var bundler = browserify(paths.jsEntryPoint, {
    // basedir: __dirname,
    debug: true,  // We want sourcemaps in production too
    cache: {},  // For watchify
    packageCache: {}  // For watchify
    // fullPaths: watch
  })

  bundler = watch ? watchify(bundler) : bundler
  bundler.transform('babelify')
  if (isProduction) {
    bundler.transform('envify', {global: true})  // Sets process.env.NODE_ENV
    bundler.transform('uglifyify', {global: true})
  }

  var rebundle = function () {
    return bundler
      .bundle()
      .on('error', interceptErrors)
      // Extracts the sourcemaps to an external file
      .pipe(exorcist(''.concat(paths.build.jsBundle, '.map')))
      // Passes desired output filename to vinyl-source-stream
      .pipe(vinylSource(paths.build.jsBundle))

      .pipe(gulp.dest(__dirname))
  }

  bundler.on('update', function () {
    console.log('Rebundle triggered!')
    rebundle().on('end', function () {
      console.log('Rebundle done!')
    })
  })
  return rebundle()
}

var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments)

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args)

  // Keep gulp from hanging on this task
  this.emit('end')
};

gulp.task('del', function() {
  return del([
    paths.build.base + '/**/*',
    '!' + paths.build.readme
  ])
})

gulp.task('mkdirs', function (callback) {
  // Some tasks/tools are crappy and behave badly when the directories do not
  // exist (I'm looking at you, exorcist). Therefore we play it safe by creating
  // them ourselves.

  [
    paths.build.css,
    paths.build.fonts,
    paths.build.html,
    paths.build.js
  ].map(function (dir) {
    mkdirp(dir)
  })

  return callback()
})

gulp.task('clean', function (callback) {

  sequence('del', 'mkdirs', callback)
})

gulp.task('css', function () {
  return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: paths.scssPaths,
      outputStyle: (isProduction ? 'compressed' : 'nested')
      // errLogToConsole: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 9']
    }))
    .pipe(sourcemaps.write('.'))
    .on('error', interceptErrors)
    .pipe(gulp.dest(paths.build.css))
})

gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.build.fonts))
})

gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.build.html))
})

gulp.task('js', function () {
  return buildJs(false)
})

gulp.task('js:watch', function () {
  return buildJs(true)
})

gulp.task('build', function (cb) {
  sequence('clean', ['css', 'fonts', 'html', 'js'], cb)
})

gulp.task('build:jswatch', function (cb) {
  sequence('clean', ['css', 'fonts', 'html', 'js:watch'], cb)
})

gulp.task('watch', ['build:jswatch'], function () {
  gulp.watch(paths.scssPaths[0] + '/**/*.scss', ['css'])
  gulp.watch(paths.html, ['html'])
})
