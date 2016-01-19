'use strict';

var should = require('chai').should(),
	lib = require('../lib/tracking'),
	mockCore = require('./mock/helper');

describe('Tracking', function() {

	beforeEach(function(done) {
		lib = lib.init(mockCore);
		done();
	});

	describe('Tracking', function() {

		it('getTrackingInfo() without Params', function(done) {
			lib.getTrackingInfo().catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingZipCode');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

	});

});