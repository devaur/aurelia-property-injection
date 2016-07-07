import gulp from "gulp";
import paths from "vinyl-paths";
import del from "del";
import run from "run-sequence";
import jasmine from "gulp-jasmine";
import reporters from "jasmine-reporters";
import istanbul from "gulp-istanbul";
import tsb from "gulp-tsb";
import tsconfig from "./tsconfig.json";
import remapIstanbul from "remap-istanbul/lib/gulpRemapIstanbul";

const typescriptSources = tsconfig.compilerOptions.rootDir + "/**/*.ts";
const typescriptOutput = tsconfig.compilerOptions.outDir;
const typescriptOutputTesting = "test/dist";
const testSuites = [ "test/unit/**/*.ts" ];
const testSuitesDist = [ "test/dist/test/unit/**/*.js" ];

const tsc = tsb.create(tsconfig.compilerOptions);
const tscTesting = tsb.create(Object.assign({}, tsconfig.compilerOptions, {
    outDir: typescriptOutputTesting,
    target: "es5",
    moduleResolution: "node",
    declaration: false
}));

gulp.task("clean", () => gulp.src([ typescriptOutput ]).pipe(paths(del)));
gulp.task("clean-test", () => gulp.src(typescriptOutputTesting).pipe(paths(del)));
gulp.task("build", [ "clean" ], () => gulp.src(typescriptSources).pipe(tsc()).pipe(gulp.dest(typescriptOutput)));
gulp.task("build-test", [ "clean-test" ], () => gulp.src(typescriptSources).pipe(tscTesting()).pipe(gulp.dest(`${typescriptOutputTesting}/src`)));
gulp.task("instrument-test", [ "build-test" ], () =>
    gulp.src(`${typescriptOutputTesting}/src/**/*.js`)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
);
gulp.task("build-unit-test", ['instrument-test'], () => gulp.src(testSuites).pipe(tscTesting()).pipe(gulp.dest(typescriptOutputTesting)));
gulp.task('test', ['build-unit-test'], () =>
    gulp.src(testSuitesDist)
        .pipe(jasmine())
        .pipe(istanbul.writeReports({
            reporters: ['json']
        }))
);
gulp.task('remap-istanbul', () =>
    gulp.src('coverage/coverage-final.json')
        .pipe(remapIstanbul({
            reports: {
                'json': 'coverage/coverage.json',
                'html': 'coverage/html-report'
            }
        }))
);
gulp.task("default", () => run("build", "test"));
