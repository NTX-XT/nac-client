const builder = require('gulp-ts-build')
const gulp = require('gulp')

gulp.task("default", builder.getBuildTask());