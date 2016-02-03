'use strict';

var should = require('chai').should(),
	lib = require('../lib/category'),
	mockCore = require('./mock/helper');

describe('Category', function() {

	beforeEach(function(done) {
		lib = lib.init(mockCore);
		done();
	});

	describe('Category', function() {

		it('getCategories() Without params', function(done) {
			lib.getCategories().then(function(result) {
				result.should.be.an('object');
				result.should.have.property('total').that.is.a('number');
				result.should.have.property('itensPerPage').that.is.a('number');
				result.should.have.property('totalPages').that.is.a('number');
				result.should.have.property('offset').that.is.a('number');
				result.should.have.property('categories').that.is.a.instanceof(Array);

				result.categories.should.have.length(100);

				done();
			});
		});

		it('getCategories(page, limit)', function(done) {
			lib.getCategories(1, 100).then(function(result) {
				result.should.be.an('object');
				result.should.have.property('total').that.is.a('number');
				result.should.have.property('itensPerPage').that.is.a('number');
				result.should.have.property('totalPages').that.is.a('number');
				result.should.have.property('offset').that.is.a('number');
				result.should.have.property('categories').that.is.a.instanceof(Array);

				result.categories.should.have.length(100);

				done();
			});
		});

		it('getAllCategories()', function(done) {
			lib.getAllCategories().then(function(result) {
				result.should.be.an('object');
				result.should.have.property('total').that.is.a('number');
				result.should.have.property('departaments').that.is.a.instanceof(Array);
				result.should.have.property('categories').that.is.a.instanceof(Array);

				done();
			});
		});

	});

});