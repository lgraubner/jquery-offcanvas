var gulp = require("gulp");
var uglify = require("gulp-uglify");
var header = require("gulp-header");
var rename = require("gulp-rename");
var minifyCSS = require("gulp-minify-css");
var stripDebug = require("gulp-strip-debug");
var jshint = require("gulp-jshint");
var mochaPhantomjs = require("gulp-mocha-phantomjs");
var babel = require("gulp-babel");
var pkg = require("./package.json");

var pluginName = pkg.name.replace(/-/g, ".");

var banner = ["/**",
    " * jQuery.offcanvas v<%= pkg.version %> - <%= pkg.description %>",
    " * Copyright " + new Date().getFullYear() + " <%= pkg.author.name %> - <%= pkg.homepage %>",
    " * License: <%= pkg.license %>",
    " */",
""].join("\n");

gulp.task("lint", function() {
    return gulp.src("src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("test", ["build"], function() {
    return gulp.src("test/runner.html")
        .pipe(mochaPhantomjs({
            reporter: "spec"
        }));
});

gulp.task("scripts", ["lint"], function() {
    return gulp.src("src/" + pluginName + ".js")
        .pipe(stripDebug())
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("styles", function() {
    return gulp.src("src/" + pluginName + ".css")
        .pipe(minifyCSS())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("build", ["scripts", "styles"]);

gulp.task("default", ["test"]);
