const gulp = require('gulp');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const stripDebug = require('gulp-strip-debug');
const eslint = require('gulp-eslint');
const mochaPhantomjs = require('gulp-mocha-phantomjs');
const pkg = require('./package.json');

const pluginName = pkg.name.replace(/-/g, '.');

const banner = `/**
 * jQuery.offcanvas v<%= pkg.version %> - <%= pkg.description %>
 * Copyright ${new Date().getFullYear()} <%= pkg.author.name %> - <%= pkg.homepage %>
 * License: <%= pkg.license %>
 */\n`;

gulp.task('lint', () => {
  return gulp.src(`src/${pluginName}.js`)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', () => {
  return gulp.src('test/runner.html')
    .pipe(mochaPhantomjs({
      reporter: 'spec',
    }));
});

gulp.task('scripts', ['lint'], () => {
  return gulp.src(`src/${pluginName}.js`)
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(header(banner, { pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('styles', () => {
  return gulp.src(`src/${pluginName}.css`)
    .pipe(cssnano())
    .pipe(header(banner, { pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['scripts', 'styles']);

gulp.task('default', ['build', 'test']);
