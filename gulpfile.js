var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    header = require("gulp-header"),
    rename = require("gulp-rename"),
    stripDebug = require("gulp-strip-debug"),
    jshint = require("gulp-jshint"),
    pkg = require("./package.json");

var pluginName = pkg.name.replace(/-/g, ".");

var banner = ["/**",
    " * <%= pkg.name %> - v<%= pkg.version %>",
    " * <%= pkg.description %>",
    " * <%= pkg.homepage %>",
    " *",
    " * Made by <%= pkg.author %>",
    " * Under <%= pkg.license %>",
    " */",
""].join("\n");

gulp.task("build", function() {
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

gulp.task("default", ["lint", "build"]);
