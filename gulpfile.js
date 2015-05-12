var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    jshint = require("gulp-jshint"),
    header = require("gulp-header"),
    rename = require("gulp-rename"),
    stripDebug = require("gulp-strip-debug"),
    pkg = require("./package.json");

var banner = ["/**",
    " * <%= pkg.description %> - v<%= pkg.version %> - build: <%= new Date().getTime() %>",
    " * <%= pkg.homepage %>",
    " * Copyright (c) 2015 Lars Graubner <mail@larsgraubner.de>",
    " * License: <%= pkg.license %>",
    " */",
""].join("\n");

gulp.task("lint", function() {
    return gulp.src("src/jquery.offcanvas.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(jshint.reporter("fail"));
});

gulp.task("build", function() {
    return gulp.src("src/jquery.offcanvas.js")
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(stripDebug())
        .pipe(rename("jquery.offcanvas.min.js"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("default", ["lint", "build"]);
