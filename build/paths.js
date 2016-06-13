var path = require('path');
var fs = require('fs');

var appRoot = 'src/';
var outputRoot = 'dist/';
var es2015output = outputRoot + 'es2015/';
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

module.exports = {
    packageName: pkg.name,
    root: appRoot,
    source: appRoot + '**/*.ts',
    html: appRoot + '**/*.html',
    style: 'styles/**/*.css',
    output: outputRoot,
    es2015output: es2015output,
    es2015source: es2015output + '**/*.js',
    doc:'./doc',
    e2eSpecsSrc: 'test/e2e/src/*.js',
    e2eSpecsDist: 'test/e2e/dist/',
    dtsSrc: [
        'typings/**/*.d.ts',
        'custom_typings/**/*.d.ts'
    ]
};
