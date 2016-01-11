'use strict';

var should = require('chai').should(),
	lib = require('../lib/products'),
	mockCore = require('./mock/helper');

describe('Products', function() {

	function testProductList(result, testDone, onlyProduct) {
		if(!onlyProduct) {
			result.should.be.an('object');
			result.should.have.property('total');
			result.should.have.property('itensPerPage');
			result.should.have.property('totalPages');
			result.should.have.property('offset');
			result.should.have.property('products');

			result.total.should.be.an('number');
			result.itensPerPage.should.be.an('number');
			result.totalPages.should.be.an('number');
			result.offset.should.be.an('number');

			result.products.should.be.instanceof(Array);
			result.products.should.have.length(100);
		}

		result.products[0].should.have.property('id').that.is.a('string');
		result.products[0].should.have.property('externalId').that.is.a('string');
		result.products[0].should.have.property('name').that.is.a('string');
		result.products[0].should.have.property('dateCreated');
		result.products[0].should.have.property('lastUpdated').that.is.a('date');
		result.products[0].should.have.property('description').that.is.a('string');
		result.products[0].should.have.property('salePrice').that.is.a('number');
		result.products[0].should.have.property('defaultPrice').that.is.a('number');
		result.products[0].should.have.property('category').that.is.an('object');
		result.products[0].category.should.have.property('id').that.is.a('string');
		result.products[0].category.should.have.property('externalId').that.is.a('string');
		result.products[0].category.should.have.property('name').that.is.a('string');
		result.products[0].should.have.property('secondaryCategories').that.is.an('object');
		result.products[0].secondaryCategories.should.have.property('id').that.is.a('string');
		result.products[0].secondaryCategories.should.have.property('externalId').that.is.a('string');
		result.products[0].secondaryCategories.should.have.property('name').that.is.a('string');
		result.products[0].should.have.property('images').that.is.a('array');
		result.products[0].images[0].should.have.property('type').that.is.a('string');
		result.products[0].images[0].should.have.property('link').that.is.a('string');
		result.products[0].should.have.property('brand').that.is.a('string');
		result.products[0].should.have.property('gift').that.is.a('boolean');
		result.products[0].should.have.property('sku').that.is.an('array');
		result.products[0].sku[0].should.have.property('id').that.is.a('string');
		result.products[0].sku[0].should.have.property('externalId').that.is.a('string');
		result.products[0].sku[0].should.have.property('salePrice').that.is.a('number');
		result.products[0].sku[0].should.have.property('defaultPrice').that.is.a('number');
		result.products[0].sku[0].should.have.property('variation').that.is.a('string');
		result.products[0].sku[0].should.have.property('isAvailable').that.is.a('boolean');

		testDone();
	}

	beforeEach(function(done) {
		lib = lib.init(mockCore);
		done();
	});

	describe('Helper functions', function() {
		it('parseProduct()', function(done) {
			var parsedProduct = lib.parseProduct({
				images: { image: 'test' },
				secondaryCategories: { category: 'test' },
				salePrice: '',
				defaultPrice: '',
				dateCreated: '11-11-2000',
				lastUpdated: '11-11-2000',
				sku: {
					salePrice: '',
					defaultPrice: ''
				},
				productInfo: { group: { param: 'test' }}
			}),
			parsedProductWithBlanklastUpdated = lib.parseProduct({
				images: { image: 'test' },
				secondaryCategories: { category: 'test' },
				salePrice: '',
				defaultPrice: '',
				dateCreated: '11-11-2000',
				lastUpdated: '',
				sku: {
					salePrice: '',
					defaultPrice: ''
				},
				productInfo: { group: { param: 'test' }}
			});

			parsedProduct.should.be.an('array');
			parsedProduct[0].should.be.an('object');

			parsedProduct[0].should.have.property('images').that.is.a('string');
			parsedProduct[0].should.have.property('secondaryCategories').that.is.a('string');
			parsedProduct[0].should.have.property('salePrice').that.is.a('number').and.is.equal(0);
			parsedProduct[0].should.have.property('defaultPrice').that.is.a('number').and.is.equal(0);
			parsedProduct[0].should.have.property('dateCreated').that.is.a('date');
			parsedProduct[0].should.have.property('lastUpdated').that.is.a('date');
			parsedProduct[0].should.have.property('sku').that.is.an('array');
			parsedProduct[0].sku[0].should.have.property('salePrice').that.is.a('number').and.is.equal(0);
			parsedProduct[0].sku[0].should.have.property('defaultPrice').that.is.a('number').and.is.equal(0);
			parsedProduct[0].should.have.property('productInfo').that.is.an('array');

			parsedProductWithBlanklastUpdated[0].should.have.property('lastUpdated').that.is.a('string');

			done();
		});

		it('parseProductInfo()', function(done) {
			var parsedProductInfo = lib.parseProductInfo({
				 group: [
					{ name: 'ITEMSTATUS', info: { property: 'Itemstatus_Itemstatus', value: 'Prod' } },
					{ name: 'Informações Técnicas', info: { property: 'InformacoesTecnicas_Itemstatus', value: 'Prod' } },
					{ name: 'Grupo SKU', info: { property: 'GrupoSku_Itemstatus', value: 'Prod' } },
					{ name: 'Características', info: { property: 'Caracteristicas_Itemstatus', value: 'Prod' } },
					{ name: 'Caracteristícas Gerais', info: [{ property: 'CaracteristicasGerais_Itemstatus', value: 'Prod' }] }
				]
			});

			parsedProductInfo.should.be.an('array');
			parsedProductInfo[0].should.have.property('name').that.is.a('string');

			parsedProductInfo[1].should.have.property('info').that.is.a('array');
			parsedProductInfo[1].info[0].should.be.an('object');
			parsedProductInfo[1].info[0].should.have.property('property').that.is.a('string').and.not.match(/_/);
			parsedProductInfo[1].info[0].should.have.property('value').that.is.a('string');

			done();
		});
	});

	describe('Catalog', function() {
		it('getCatalog()', function(done) {
			lib.getCatalog().then(function(result) {
				testProductList(result, done);
			});
		});

		it('getCatalogByLastUpdate() Without passing a DateLimit', function(done) {
			lib.getCatalogByLastUpdate()
				.catch(function(result) {
					result.should.be.an('object');
					result.should.have.property('sucess').that.is.equal(false);
					result.should.have.property('code').that.is.equal('invalidDate');
					result.should.have.property('message').that.is.a('string');

					done();
				});
		});

		it('getCatalogByLastUpdate(1)', function(done) {
			lib.getCatalogByLastUpdate(1)
				.then(function(result) {
					testProductList(result, done);
				});
		});
	});

	describe('getProduct', function() {
		it('getProduct() Without passing an id', function(done) {
			lib.getProduct().catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('sucess').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingId');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('getProduct() using a non-existing product', function(done) {
			lib.getProduct(321).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('sucess').that.is.equal(false);
				result.should.have.property('code').that.is.equal('productNotFound');
				result.should.have.property('message').that.is.a('string');

				return lib.getProduct(3211);
			}).catch(function(err) {
				err.should.be.an.instanceof(TypeError);

				done();
			});
		});

		it('getProduct(123)', function(done) {
			lib.getProduct(123)
				.then(function(result) {
					result.should.be.an('object');

					result.should.have.property('id').that.is.a('string');
					result.should.have.property('externalId').that.is.a('string');
					result.should.have.property('name').that.is.a('string');
					result.should.have.property('dateCreated');
					result.should.have.property('lastUpdated').that.is.a('date');
					result.should.have.property('description').that.is.a('string');
					result.should.have.property('salePrice').that.is.a('number');
					result.should.have.property('defaultPrice').that.is.a('number');
					result.should.have.property('category').that.is.an('object');
					result.category.should.have.property('id').that.is.a('string');
					result.category.should.have.property('externalId').that.is.a('string');
					result.category.should.have.property('name').that.is.a('string');
					result.should.have.property('secondaryCategories').that.is.an('object');
					result.secondaryCategories.should.have.property('id').that.is.a('string');
					result.secondaryCategories.should.have.property('externalId').that.is.a('string');
					result.secondaryCategories.should.have.property('name').that.is.a('string');
					result.should.have.property('images').that.is.a('array');
					result.images[0].should.have.property('type').that.is.a('string');
					result.images[0].should.have.property('link').that.is.a('string');
					result.should.have.property('brand').that.is.a('string');
					result.should.have.property('gift').that.is.a('boolean');
					result.should.have.property('sku').that.is.an('array');
					result.sku[0].should.have.property('id').that.is.a('string');
					result.sku[0].should.have.property('externalId').that.is.a('string');
					result.sku[0].should.have.property('salePrice').that.is.a('number');
					result.sku[0].should.have.property('defaultPrice').that.is.a('number');
					result.sku[0].should.have.property('variation').that.is.a('string');
					result.sku[0].should.have.property('isAvailable').that.is.a('boolean');

					done();
				});
		});
	});

	describe('getProductsByCategory', function() {
		it('getProductsByCategory() Without passing an id', function(done) {
			lib.getProductsByCategory().catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('sucess').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingId');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('getProductsByCategory() using a non-existing product', function(done) {
			lib.getProductsByCategory(321).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('sucess').that.is.equal(false);
				result.should.have.property('code').that.is.equal('categoryNotFound');
				result.should.have.property('message').that.is.a('string');

				return lib.getProductsByCategory(3211);
			}).catch(function(err) {
				err.should.be.an.instanceof(TypeError);

				done();
			});
		});

		it('getProductsByCategory(123)', function(done) {
			lib.getProductsByCategory(123)
				.then(function(result) {
					testProductList(result, done);
				});
		});
	});

	describe('getSkus', function() {
		it('getSkus() Without passing an id', function(done) {
			lib.getSkus().catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('sucess').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingIds');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('getSkus() using a non-existing product', function(done) {
			lib.getSkus(987).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('sucess').that.is.equal(false);
				result.should.have.property('code').that.is.equal('skuNotFound');
				result.should.have.property('message').that.is.a('string');

				return lib.getSkus(789);
			}).catch(function(err) {
				err.should.be.an.instanceof(TypeError);
				done();
			});
		});

		it('getSkus() using array of ids', function(done) {
			lib.getSkus([321, 456]).then(function(result) {
				testProductList(result, done, true);
			});
		});

		it('getSkus() using a single sku', function(done) {
			lib.getSkus(123)
				.then(function(result) {
					testProductList(result, done, true);
				});
		});
	});

	describe('getSkuAvailability', function() {
		it('getSkuAvailability() Without passing an id', function(done) {
			lib.getSkuAvailability().catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('sucess').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingId');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('getSkuAvailability() using a non-existing product', function(done) {
			lib.getSkuAvailability(321).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('sucess').that.is.equal(false);
				result.should.have.property('code').that.is.equal('skuNotFound');
				result.should.have.property('message').that.is.a('string');

				return lib.getSkuAvailability(3211);
			}).catch(function(err) {
				err.should.be.an.instanceof(TypeError);
				done();
			});
		});

		it('getSkuAvailability(123)', function(done) {
			lib.getSkuAvailability(123)
				.then(function(result) {
					result.should.be.an('object');
					result.should.have.property('externalId').that.is.a('string');
					result.should.have.property('name').that.is.a('string');
					result.should.have.property('isAvailable').that.is.equal(true);
					result.should.have.property('salePrice').that.is.a('number');
					result.should.have.property('defaultPrice').that.is.a('number');
					done();
				});
		});
	});

});