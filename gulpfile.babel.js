import gulp from "gulp";
import paths from "vinyl-paths";
import del from "del";
import run from "run-sequence";
import jasmine from "gulp-jasmine";
import reporters from "jasmine-reporters";
import tsb from "gulp-tsb";
import tsconfig from "./tsconfig.json";

const tsc = tsb.create(tsconfig.compilerOptions);
const typescriptSources = [ tsconfig.compilerOptions.rootDir + "/**/*.ts" ];
const typescriptOutput = tsconfig.compilerOptions.outDir;
const testSuites = [ "test/**/*.js" ];
const clean = [ typescriptOutput ];

gulp.task("clean", done => gulp.src(clean).pipe(paths(del)));
gulp.task("build", [ "clean" ], done => gulp.src(typescriptSources).pipe(tsc()).pipe(gulp.dest(typescriptOutput)));
gulp.task("test", [ "build" ], done => gulp.src(testSuites).pipe(jasmine()));
gulp.task("default", () => run("build", "test"));
