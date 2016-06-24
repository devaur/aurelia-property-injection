import gulp from "gulp";
import paths from "vinyl-paths";
import del from "del";
import run from "run-sequence";
import jasmine from "gulp-jasmine";
import reporters from "jasmine-reporters";
import tsb from "gulp-tsb";
import tsconfig from "./tsconfig.json";

const typescriptSources = [ tsconfig.compilerOptions.rootDir + "/**/*.ts" ];
const typescriptOutput = tsconfig.compilerOptions.outDir;
const typescriptOutputTesting = "test/dist";
const testSuites = [ "test/unit/**/*.js" ];

const tsc = tsb.create(tsconfig.compilerOptions);
const tscTesting = tsb.create(Object.assign({}, tsconfig.compilerOptions, {
    outDir: typescriptOutputTesting,
    target: "es6",
    moduleResolution: "node",
    sourceMap: false,
    declaration: false
}));

gulp.task("clean", done => gulp.src([ typescriptOutput ]).pipe(paths(del)));
gulp.task("clean-test", done => gulp.src([ typescriptOutputTesting ]).pipe(paths(del)));
gulp.task("build", [ "clean" ], done => gulp.src(typescriptSources).pipe(tsc()).pipe(gulp.dest(typescriptOutput)));
gulp.task("build-test", [ "clean-test" ], done => gulp.src(typescriptSources).pipe(tscTesting()).pipe(gulp.dest(typescriptOutputTesting)));
gulp.task("test", [ "build-test" ], done => gulp.src(testSuites).pipe(jasmine()));
gulp.task("default", () => run("build", "test"));
