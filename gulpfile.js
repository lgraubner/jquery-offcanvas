var gulp = require("gulp");
var uglify = require("gulp-uglify");
var header = require("gulp-header");
var rename = require("gulp-rename");
var stripDebug = require("gulp-strip-debug");
var jshint = require("gulp-jshint");
var mochaPhantomjs = require("gulp-mocha-phantomjs");
var pkg = require("./package.json");

var pluginName = pkg.name.replace(/-/g, ".");

var banner = ["/**",
    " * <%= pkg.name %> - v<%= pkg.version %>",
    " * <%= pkg.description %>",
    " * <%= pkg.homepage %>",
    " *",
    " * Copyright <%= pkg.author %>",
    " * Under <%= pkg.license %> License",
    " */",
""].join("\n");

gulp.task("build", ["lint", "test"], function() {
    return gulp.src("src/" + pluginName + ".js")
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename(pluginName + ".min.js"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("lint", function() {
    return gulp.src("src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("test", function() {
    return gulp.src("test/runner.html")
        .pipe(mochaPhantomjs({
            reporter: "spec"
        }));
});

gulp.task("default", ["build"]);
