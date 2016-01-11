var should = require('chai').should(),
	expect = require('chai').expect,
	request = require('supertest'),
	app = require('./mock/app'),
	agent = request(app),
	realLib = require('../index');

describe('Checking xml mock', function() {

	it('GET /product', function(done) {
		agent.get('product.xml')
			.expect(200)
			.end(function (err, res) {
				res.text.should.match(/xml/);
				done();
			});
	});

});

describe('Testing App', function() {

	it('Missing params', function(done) {
		try {
			realLib()
		} catch (err) {
			err.should.be.an.instanceof(Error);
			done();
		}
	});

	it('Dev Env', function(done) {
		var lib = realLib({
			symbol: 'symbolTest',
			company: 'Americanas',
			login: 'loginTest',
			password: 'passwordTest'
		}, 'development');

		lib.coreAPI.rootUrl.should.be.equal('http://homologacao.b2bamericanas.com.br/commerce-api/api/');
		done();
	});

	it('Check Index', function(done) {
		var lib = realLib({
			symbol: 'symbolTest',
			company: 'Americanas',
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

	it('parseResponse Error', function(done) {
		var lib = realLib({
			symbol: 'symbolTest',
			company: 'Americanas',
			login: 'loginTest',
			password: 'passwordTest'
		}, 'development');

		lib.coreAPI.parseResponse('')
			.catch(function(err){
				err.should.be.an.instanceof(TypeError);
				done();
			});
	});

	it('errorHandler Without valid Section', function(done) {
		var lib = realLib({
			symbol: 'symbolTest',
			company: 'Americanas',
			login: 'loginTest',
			password: 'passwordTest'
		}, 'development');

		lib.coreAPI.errorHandler('test', 'teste')
			.catch(function(err){
				err.should.be.an('object');
				err.should.have.property('sucess').that.is.equal(false);
				err.should.have.property('code').that.is.equal('teste');
				err.should.have.property('message').that.is.a('string');
				done();
			});
	});

	it('errorHandler Without valid Code', function(done) {
		var lib = realLib({
			symbol: 'symbolTest',
			company: 'Americanas',
			login: 'loginTest',
			password: 'passwordTest'
		}, 'development');

		lib.coreAPI.errorHandler('core', 'teste')
			.catch(function(err){
				err.should.be.an('object');
				err.should.have.property('sucess').that.is.equal(false);
				err.should.have.property('code').that.is.equal('teste');
				err.should.have.property('message').that.is.a('string');
				done();
			});
	});

	it('MakeRequest with Params', function(done) {
		this.timeout(10000);
		var lib = realLib({
			symbol: 'symbolTest',
			company: 'Americanas',
			login: 'loginTest',
			password: 'passwordTest'
		}, 'development');

		lib.coreAPI.makeRequest('GET', 'product', {
				offset: 0,
				showInfo: true,
				max: 2
			})
			.catch(function(erro){
				erro.code.should.be.equal('requestError');
				done();
			});
	});

	it('MakeRequest without Params', function(done) {
		this.timeout(10000);
		var lib = realLib({
			symbol: 'symbolTest',
			company: 'Americanas',
			login: 'loginTest',
			password: 'passwordTest'
		}, 'development');

		lib.coreAPI.makeRequest('GET', 'product')
			.catch(function(erro){
				erro.code.should.be.equal('requestError');
				done();
			});
	});

});