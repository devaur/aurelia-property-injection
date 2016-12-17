import gulp from 'gulp';
import paths from 'vinyl-paths';
import del from 'del';
import run from 'run-sequence';
import jasmine from 'gulp-jasmine';
import reporters from 'jasmine-reporters';
import istanbul from 'gulp-istanbul';
import typescript from 'typescript';
import gts from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
import merge from "merge2";
import tsconfig from './tsconfig.json';
import remapIstanbul from 'remap-istanbul/lib/gulpRemapIstanbul';

const typescriptSources = tsconfig.compilerOptions.rootDir + '/**/*.ts';
const typescriptOutput = tsconfig.compilerOptions.outDir;
const testSuites = [ 'dist/test/unit/**/*.js' ];

const tsc = gts(Object.assign({ typescript: typescript }, tsconfig.compilerOptions));

gulp.task('clean', done => gulp.src([ typescriptOutput ]).pipe(paths(del)));
gulp.task('build', [ 'clean' ], done => {
    let stream = gulp.src(typescriptSources).pipe(sourcemaps.init()).pipe(tsc);
    return merge([
        stream.js.pipe(sourcemaps.write('.', { mapSources: sourcePath => '../' + sourcePath }))
            .pipe(gulp.dest(typescriptOutput)),
        stream.dts.pipe(gulp.dest(typescriptOutput))
    ]);
});
gulp.task('instrument-test', [ 'build' ], done => {
    return gulp.src(typescriptOutput + '/main/**/*.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});
gulp.task('test', [ 'instrument-test' ], done => {
    return gulp.src(testSuites)
        .pipe(jasmine())
        .pipe(istanbul.writeReports({
            reporters: [ 'json' ]
        }));
});
gulp.task('remap-istanbul', done => {
    return gulp.src('coverage/coverage-final.json')
        .pipe(remapIstanbul({
            reports: {
                'lcovonly': 'coverage/lcov.info',
                'json': 'coverage/coverage.json',
                'html': 'coverage/html-report'
            }
        }));
});
gulp.task('default', done => run('test'));
