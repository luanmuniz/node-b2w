'use strict';

let gulp = require('gulp');
let istanbul = require('gulp-istanbul');
let mocha = require('gulp-mocha');
let coverage = require('../coverage');
let paths = require('../paths');

let allFiles = paths.js.concat(paths.testFiles);

gulp.task('pre-test', ['lint'], done => {
	process.env.NODE_ENV = 'test';
	return gulp.src(paths.js)
		.pipe(istanbul())
		.once('error', handleError(done))
		.pipe(istanbul.hookRequire());
});

gulp.task('test', [ 'pre-test' ], done => {
	return gulp.src(allFiles)
		.pipe(mocha())
		.once('error', handleError(done, true))
		.pipe(istanbul.writeReports())
		.pipe(istanbul.enforceThresholds({
			thresholds: coverage
		}))
		.once('error', () => {
			console.log('MINIMUM COVERAGE:\n', coverage.global);
			console.log('='.repeat(80));
			process.exit(1);
		})
		.once('end', handleError(done));
});

function handleError(done, exit) {
	return (err) => {
		console.log('ERROR:');
		console.error(err);
		done();
		process.exit();
	};
}

function isDevelopment() {
	return (process.env.NODE_ENV || 'development') === 'development';
}
