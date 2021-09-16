var gulp = require('gulp');
var ts = require("gulp-typescript");
var del = require('del');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge-stream');
var deleteLines = require('gulp-delete-lines');

var tsProject = ts.createProject("tsconfig.json");

gulp.task("clean", async() => {
    del("./dist/*");
});

gulp.task("build", async() => {
    const tsResult =
        tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())

    return merge([
        tsResult.dts
        .pipe(concat('index.d.ts'))
        .pipe(deleteLines({
             'filters': [/^import.+?[.][/]/i]
        }))
        .pipe(gulp.dest('dist')),
        tsResult.js
        .pipe(concat('index.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist')),
        gulp.src('src/**/*.json').pipe(gulp.dest("dist"))
    ]);
});

gulp.task("default", gulp.series("clean", "build"));