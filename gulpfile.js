const gulp = require("gulp");
const uglify = require("gulp-uglify");
const header = require("gulp-header");
const rename = require("gulp-rename");
const minifyCSS = require("gulp-minify-css");
const stripDebug = require("gulp-strip-debug");
const jshint = require("gulp-jshint");
const mochaPhantomjs = require("gulp-mocha-phantomjs");
const babel = require("gulp-babel");
const pkg = require("./package.json");

var pluginName = pkg.name.replace(/-/g, ".");

var banner = ["/**",
    " * jQuery.offcanvas v<%= pkg.version %> - <%= pkg.description %>",
    " * Copyright " + new Date().getFullYear() + " <%= pkg.author.name %> - <%= pkg.homepage %>",
    " * License: <%= pkg.license %>",
    " */",
""].join("\n");

gulp.task("lint", () => {
    return gulp.src("src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("test", ["build"], () => {
    return gulp.src("test/runner.html")
        .pipe(mochaPhantomjs({
            reporter: "spec"
        }));
});

gulp.task("scripts", ["lint"], () => {
    return gulp.src(`src/${pluginName}.js`)
        .pipe(stripDebug())
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("styles", () => {
    return gulp.src(`src/${pluginName}.css`)
        .pipe(minifyCSS())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("build", ["scripts", "styles"]);

gulp.task("default", ["test"]);
