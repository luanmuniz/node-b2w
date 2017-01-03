'use strict';

var should = require('chai').should(),
	lib = require('../lib/tracking'),
	mockCore = require('./mock/helper');

describe('Tracking', function() {

	function validateTracking(result, done) {
		result.should.be.an('object');
		result.should.have.property('deliveryDate').that.is.a('date');
		result.should.have.property('value').that.is.a('number');
		result.should.have.property('discount').that.is.a('number');
		result.should.have.property('total').that.is.a('number');
		result.should.have.property('scheduledDelivery').that.is.a('object');

		result.total.should.be.equal(result.value - result.discount);

		result.scheduledDelivery.should.have.property('dates').that.is.a('array');
		result.scheduledDelivery.should.have.property('value').that.is.a('number');
		result.scheduledDelivery.should.have.property('periods').that.is.a('array');

		result.scheduledDelivery.dates[0].should.be.a('date');
		result.scheduledDelivery.periods[0].should.be.equal('MANHA');
		result.scheduledDelivery.periods[1].should.be.equal('TARDE');

		done();
	}

	beforeEach(function(done) {
		lib = lib.init(mockCore);
		done();
	});

	describe('getTrackingInfo', function() {
		it('getTrackingInfo() without Params', function(done) {
			lib.getTrackingInfo().catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingZipCode');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('getTrackingInfo() with invalid CEP', function(done) {
			lib.getTrackingInfo('123456').catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingZipCode');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('getTrackingInfo() without paymentType', function(done) {
			lib.getTrackingInfo('04570000').catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingPayment');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('getTrackingInfo() without skuObj', function(done) {
			lib.getTrackingInfo('04570000', 'corporate').catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingSku');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('getTrackingInfo() without skuObj.id', function(done) {
			lib.getTrackingInfo('04570000', 'corporate', { nothing: '' }).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingSku');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('getTrackingInfo()', function(done) {
			lib.getTrackingInfo('04570000', 'corporate', { id: '123456', quantity: 1 }, '123')
				.then(function(result) {
					validateTracking(result, done);
				});
		});

		it('getTrackingInfo() by creditCard', function(done) {
			lib.getTrackingInfo('04570000', 'mastercard', { id: '123456' })
				.then(function(result) {
					validateTracking(result, done);
				});
		});

		it('getTrackingInfo() with similar', function(done) {
			lib.getTrackingInfo('04570000', 'corporate', { similar: '123456' })
				.then(function(result) {
					validateTracking(result, done);
				});
		});

		it('getTrackingInfo() with wrong CEP', function(done) {
			lib.getTrackingInfo('12345678', 'corporate', { id: '123456' })
				.catch(function(err) {
					console.log(err);
					err.should.be.an('object');
					err.should.have.property('success').that.is.equal(false);
					err.should.have.property('code').that.is.equal('9000');
					err.should.have.property('message').that.is.a('string');
					done();
				});
		});

	});

});