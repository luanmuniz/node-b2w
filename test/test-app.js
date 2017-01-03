var should = require('chai').should(),
	expect = require('chai').expect,
	realLib = require('../index'),
	fakeLib = require('./mock/helper');

describe('Testing App', function() {

	describe('Lib Init', function() {

		it('Missing params', function(done) {
			try {
				realLib()
			} catch (err) {
				err.should.be.an.instanceof(Error);
				done();
			}
		});

		it('Lib Without valid shop', function(done) {
			try {
				realLib({
					symbol: 'symbolTest',
					company: 'invalido',
					login: 'loginTest',
					password: 'passwordTest'
				}, 'development')
			} catch (err) {
				err.should.be.an.instanceof(Error);
				done();
			}
		});

		it('Dev Env', function(done) {
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'americanas',
				login: 'loginTest',
				password: 'passwordTest'
			}, 'development');

			lib.coreAPI.rootUrl.should.be.equal('http://homologacao.b2bamericanas.com.br/commerce-api/api/');
			done();
		});

		it('Check Index', function(done) {
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'americanas',
				login: 'loginTest',
				password: 'passwordTest'
			});

			lib.should.have.property('products');
			lib.products.should.have.property('init').that.is.a('function');
			lib.products.should.have.property('parseProduct').that.is.a('function');
			lib.products.should.have.property('parseProductInfo').that.is.a('function');
			lib.products.should.have.property('getCatalog').that.is.a('function');
			lib.products.should.have.property('getCatalogByLastUpdate').that.is.a('function');
			lib.products.should.have.property('getProduct').that.is.a('function');
			lib.products.should.have.property('getProductsByCategory').that.is.a('function');
			lib.products.should.have.property('getSkus').that.is.a('function');
			lib.products.should.have.property('getSkuAvailability').that.is.a('function');

			done();
		});

		it('Check Index With Submarino', function(done) {
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'Submarino',
				login: 'loginTest',
				password: 'passwordTest'
			});

			lib.should.have.property('products');
			lib.products.should.have.property('init').that.is.a('function');
			lib.products.should.have.property('parseProduct').that.is.a('function');
			lib.products.should.have.property('parseProductInfo').that.is.a('function');
			lib.products.should.have.property('getCatalog').that.is.a('function');
			lib.products.should.have.property('getCatalogByLastUpdate').that.is.a('function');
			lib.products.should.have.property('getProduct').that.is.a('function');
			lib.products.should.have.property('getProductsByCategory').that.is.a('function');
			lib.products.should.have.property('getSkus').that.is.a('function');
			lib.products.should.have.property('getSkuAvailability').that.is.a('function');

			done();
		});

		it('Check Index With Shoptime', function(done) {
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'shoptime',
				login: 'loginTest',
				password: 'passwordTest'
			});

			lib.should.have.property('products');
			lib.products.should.have.property('init').that.is.a('function');
			lib.products.should.have.property('parseProduct').that.is.a('function');
			lib.products.should.have.property('parseProductInfo').that.is.a('function');
			lib.products.should.have.property('getCatalog').that.is.a('function');
			lib.products.should.have.property('getCatalogByLastUpdate').that.is.a('function');
			lib.products.should.have.property('getProduct').that.is.a('function');
			lib.products.should.have.property('getProductsByCategory').that.is.a('function');
			lib.products.should.have.property('getSkus').that.is.a('function');
			lib.products.should.have.property('getSkuAvailability').that.is.a('function');

			done();
		});
	});

	describe('Parsers', function() {
		it('JSON2XML Parser', function(done) {
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'americanas',
				login: 'loginTest',
				password: 'passwordTest'
			}, 'development');

			var result = lib.coreAPI.parseXML({ hi: 'hi' });
			result.should.be.an('string');
			result.should.be.equal('<order><hi>hi</hi></order>');
			done();
		});

		it('parseResponse Error', function(done) {
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'americanas',
				login: 'loginTest',
				password: 'passwordTest'
			}, 'development');

			lib.coreAPI.parseResponse('')
				.catch(function(err){
					err.should.be.an.instanceof(TypeError);
					done();
				});
		});

		it('parseResponse Processor', function(done) {
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'americanas',
				login: 'loginTest',
				password: 'passwordTest'
			}, 'development');

			lib.coreAPI.parseResponse({ body: '<root><isTrue>true</isTrue><isFalse>false</isFalse><isTrueC>TRUE</isTrueC><isFalseC>FALSE</isFalseC></root>'})
				.then(function(result){
					result.should.be.an('object');
					result.should.have.property('root').that.is.a('object');

					result.root.should.have.property('isTrue').that.is.equal(true);
					result.root.should.have.property('isTrueC').that.is.equal(true);
					result.root.should.have.property('isFalse').that.is.equal(false);
					result.root.should.have.property('isFalseC').that.is.equal(false);
					done();
				});
		});
	});

	describe('errorHandler', function() {
		it('errorHandler Without valid Section', function(done) {
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'americanas',
				login: 'loginTest',
				password: 'passwordTest'
			}, 'development');

			lib.coreAPI.errorHandler('test', 'teste')
				.catch(function(err){
					err.should.be.an('object');
					err.should.have.property('success').that.is.equal(false);
					err.should.have.property('code').that.is.equal('teste');
					err.should.have.property('message').that.is.a('string');
					done();
				});
		});

		it('errorHandler Without valid Code', function(done) {
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'americanas',
				login: 'loginTest',
				password: 'passwordTest'
			}, 'development');

			lib.coreAPI.errorHandler('core', 'teste')
				.catch(function(err){
					err.should.be.an('object');
					err.should.have.property('success').that.is.equal(false);
					err.should.have.property('code').that.is.equal('teste');
					err.should.have.property('message').that.is.a('string');
					done();
				});
		});

		it('errorHandler with Error', function(done) {
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'americanas',
				login: 'loginTest',
				password: 'passwordTest'
			}, 'development');

			lib.coreAPI.errorHandler('core', 'teste', {
				statusCode: 501,
				error: {
					error_code: '8001',
					error_message: 'Error'
				}
			})
				.catch(function(err){
					err.should.be.an('object');
					err.should.have.property('success').that.is.equal(false);
					err.should.have.property('code').that.is.equal('teste');
					err.should.have.property('message').that.is.a('string');
					done();
				});
		});
	});

	describe('MakeRequest', function() {

		it('MakeRequest with Params', function(done) {
			this.timeout(10000);
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'americanas',
				login: 'loginTest',
				password: 'passwordTest'
			}, 'development');

			lib.coreAPI.makeRequest('GET', 'product', {
					offset: 0,
					showInfo: true,
					max: 2
				})
				.catch(function(erro){
					console.log(erro);
					erro.code.should.be.equal('requestError');
					done();
				});
		});

		it('MakeRequest without Params', function(done) {
			this.timeout(10000);
			var lib = realLib({
				symbol: 'symbolTest',
				company: 'americanas',
				login: 'loginTest',
				password: 'passwordTest'
			}, 'development');

			lib.coreAPI.makeRequest('GET', 'product')
				.catch(function(erro){
					console.log(erro);
					erro.code.should.be.equal('requestError');
					done();
				});
		});

	});

});