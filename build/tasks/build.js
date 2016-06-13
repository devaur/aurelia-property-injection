var gulp = require('gulp');
var runSequence = require('run-sequence');
var to5 = require('gulp-babel');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var typescript = require('gulp-tsb');
var tscOptions = require('../../tsconfig.json').compilerOptions;
var typescriptCompiler = typescriptCompiler || null;

gulp.task('build-html', function () {
    return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'es2015'))
    .pipe(gulp.dest(paths.output + 'commonjs'))
    .pipe(gulp.dest(paths.output + 'amd'))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-es2015', function () {
    if (typescriptCompiler === null) {
        typescriptCompiler = typescript.create(tscOptions);
    }
    return gulp.src(paths.dtsSrc.concat([ paths.source ]))
    .pipe(typescriptCompiler())
    .pipe(gulp.dest(paths.es2015output));
});

gulp.task('build-commonjs', ['build-es2015'], function () {
    return gulp.src(paths.es2015source)
    .pipe(to5(assign({}, compilerOptions.commonjs())))
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-amd', ['build-es2015'], function () {
    return gulp.src(paths.es2015source)
    .pipe(to5(assign({}, compilerOptions.amd())))
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-system', ['build-es2015'], function () {
    return gulp.src(paths.es2015source)
    .pipe(to5(assign({}, compilerOptions.system())))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build', function(callback) {
    return runSequence(
        'clean',
        ['build-html', 'build-es2015'],
        ['build-commonjs', 'build-amd', 'build-system'],
        callback
    );
});
