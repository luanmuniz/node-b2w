'use strict';

var should = require('chai').should(),
	lib = require('../lib/order'),
	mockCore = require('./mock/helper');

describe('Order', function() {

	function checkOrder(orderObj, done) {
		orderObj.should.be.an('object');
		orderObj.should.have.property('id').that.is.a('string');
		orderObj.should.have.property('partnerId').that.is.a('string');
		orderObj.should.have.property('creationDate').that.is.a('date');
		orderObj.should.have.property('customer').that.is.a.instanceof(Object);
		orderObj.should.have.property('address').that.is.a.instanceof(Object);
		orderObj.should.have.property('order').that.is.a.instanceof(Object);

		orderObj.customer.should.have.property('id').that.is.a('string');
		orderObj.customer.should.have.property('name').that.is.a('string');

		orderObj.address.should.have.property('shipping').that.is.a('object');
		orderObj.address.should.have.property('billing').that.is.a('object');

		orderObj.address.shipping.should.have.property('id').that.is.a('string');
		orderObj.address.shipping.should.have.property('contactName').that.is.a('string');
		orderObj.address.shipping.should.have.property('nickname').that.is.a('string');
		orderObj.address.shipping.should.have.property('street').that.is.a('string');
		orderObj.address.shipping.should.have.property('number').that.is.a('string');
		orderObj.address.shipping.should.have.property('neighborhood').that.is.a('string');
		orderObj.address.shipping.should.have.property('complement').that.is.a('string');
		orderObj.address.shipping.should.have.property('city').that.is.a('string');
		orderObj.address.shipping.should.have.property('state').that.is.a('string').and.have.length(2);
		orderObj.address.shipping.should.have.property('zipcode').that.is.a('string').and.have.length(8);

		orderObj.address.billing.should.have.property('id').that.is.a('string');
		orderObj.address.billing.should.have.property('contactName').that.is.a('string');
		orderObj.address.billing.should.have.property('nickname').that.is.a('string');
		orderObj.address.billing.should.have.property('street').that.is.a('string');
		orderObj.address.billing.should.have.property('number').that.is.a('string');
		orderObj.address.billing.should.have.property('neighborhood').that.is.a('string');
		orderObj.address.billing.should.have.property('complement').that.is.a('string');
		orderObj.address.billing.should.have.property('city').that.is.a('string');
		orderObj.address.billing.should.have.property('state').that.is.a('string').and.have.length(2);

		orderObj.order.should.have.property('products').that.is.a('array');
		orderObj.order.should.have.property('delivery').that.is.a('object');
		orderObj.order.should.have.property('payment').that.is.a('object');
		orderObj.order.should.have.property('orderDiscount').that.is.a('number');
		orderObj.order.should.have.property('orderTotal').that.is.a('number');

		orderObj.order.products[0].should.have.property('productId').that.is.a('string');
		orderObj.order.products[0].should.have.property('skuId').that.is.a('string');
		orderObj.order.products[0].should.have.property('name').that.is.a('string');
		orderObj.order.products[0].should.have.property('isGift').that.is.a('boolean');
		orderObj.order.products[0].should.have.property('quantity').that.is.a('number');
		orderObj.order.products[0].should.have.property('price').that.is.a('number');
		orderObj.order.products[0].should.have.property('finalPrice').that.is.a('number');
		orderObj.order.products[0].should.have.property('discount').that.is.a('number');
		orderObj.order.products[0].should.have.property('totalPrice').that.is.a('number');
		orderObj.order.products[0].should.have.property('delivery').that.is.a('object');

		orderObj.order.products[0].delivery.should.have.property('eta').that.is.a('date');
		orderObj.order.products[0].delivery.should.have.property('value').that.is.a('number');
		orderObj.order.products[0].delivery.should.have.property('discount').that.is.a('number');
		orderObj.order.products[0].delivery.should.have.property('total').that.is.a('number');

		orderObj.order.delivery.should.have.property('eta').that.is.a('date');
		orderObj.order.delivery.should.have.property('value').that.is.a('number');
		orderObj.order.delivery.should.have.property('discount').that.is.a('number');
		orderObj.order.delivery.should.have.property('total').that.is.a('number');

		done();
	}

	beforeEach(function(done) {
		lib = lib.init(mockCore);
		done();
	});

	describe('getOrder()', function() {

		it('getOrder(123)', function(done) {
			lib.getOrder(123).then(function(result) {
				checkOrder(result, done);
			});
		});

		it('getOrder(1234)', function(done) {
			lib.getOrder(1234).then(function(result) {
				checkOrder(result, done);
			});
		});

		it('getOrder() Without params', function(done) {
			lib.getOrder().catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingId');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('getOrder() with id not found', function(done) {
			lib.getOrder(321).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('orderNotFound');
				result.should.have.property('message').that.is.a('string');

				return lib.getOrder(3211);
			}).catch(function(err) {
				err.should.be.an.instanceof(TypeError);
				done();
			});
		});

	});

	describe('createOrder()', function() {

		it('createOrder() without params', function(done) {
			lib.createOrder().catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingParams');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('createOrder() success', function(done) {
			lib.createOrder({
				partnerId: '123456',
				sku: [{ id: '123', price: 123.12 }, { id: '1234', price: 321.12 }],
				user: {
					email: 'asd@asd.com',
					type: 'PF',
					birthdate: new Date(1991, 7, 2),
					gender: 'male',
					documentNumber: '123.767.807-21',
					name: 'Luan Muniz Teixeira',
					nickname: 'Luan',
					phones: [{ type: 'cellphone', ddd: 21, number: 961417010 }, { type: 'residential', ddd: 11, number: 33325698 }]
				},
				tracking: { deliveryDate: new Date(2090, 10, 2), value: 2.99, discount: 0, total: 2.99 },
				payment: { type: 'corporate', cnpj: '12923905000112', gender: 'male' },
				address: {
					shipping: {
						contactName: 'Luan Muniz',
						street: 'Av Nova independencia',
						number: 37,
						complement: 'Apto 113',
						neighborhood: 'brooklyn novo',
						city: 'São Paulo',
						state: 'SP',
						zipcode: '04570000',
						addressName: 'Casa'
					}
				}
			}).then(function(result) {
				result.should.be.a('object');
				result.should.have.property('id').that.is.a('string');
				result.should.have.property('partnerId').that.is.a('string');
				result.should.have.property('items').that.is.a('array');
				result.items[0].should.have.property('skuId').that.is.a('string');
				result.items[0].should.have.property('subInventory').that.is.a('string');
				done();
			});
		});

		it('createOrder() success with only one product', function(done) {
			lib.createOrder({
				partnerId: '123',
				sku: [{ id: '123', price: 123.12 }],
				user: {
					email: 'asd@asd.com',
					type: 'PF',
					birthdate: new Date(1991, 7, 2),
					gender: 'male',
					documentNumber: '123.767.807-21',
					name: 'Luan Muniz Teixeira',
					nickname: 'Luan',
					phones: [{ type: 'cellphone', ddd: 21, number: 961417010 }, { type: 'residential', ddd: 11, number: 33325698 }]
				},
				tracking: { deliveryDate: new Date(2090, 10, 2), value: 2.99, discount: 0, total: 2.99 },
				payment: { type: 'corporate', cnpj: '12923905000112', gender: 'male' },
				address: {
					shipping: {
						contactName: 'Luan Muniz',
						street: 'Av Nova independencia',
						number: 37,
						complement: 'Apto 113',
						neighborhood: 'brooklyn novo',
						city: 'São Paulo',
						state: 'SP',
						zipcode: '04570000',
						addressName: 'Casa'
					}
				}
			}).then(function(result) {
				result.should.be.a('object');
				result.should.have.property('id').that.is.a('string');
				result.should.have.property('partnerId').that.is.a('string');
				result.should.have.property('items').that.is.a('array');
				result.items[0].should.have.property('skuId').that.is.a('string');
				result.items[0].should.have.property('subInventory').that.is.a('string');
				done();
			});
		});

		it('createOrder() with error', function(done) {
			lib.createOrder({
				partnerId: '321',
				sku: [{ id: '123', price: 123.12 }, { id: '1234', price: 321.12 }],
				user: {
					email: 'asd@asd.com',
					type: 'PF',
					birthdate: new Date(1991, 7, 2),
					gender: 'male',
					documentNumber: '123.767.807-21',
					name: 'Luan Muniz Teixeira',
					nickname: 'Luan',
					phones: [{ type: 'cellphone', ddd: 21, number: 961417010 }, { type: 'residential', ddd: 11, number: 33325698 }]
				},
				tracking: { deliveryDate: new Date(2090, 10, 2), value: 2.99, discount: 0, total: 2.99 },
				payment: { type: 'corporate', cnpj: '12923905000112', gender: 'male' },
				address: {
					shipping: {
						contactName: 'Luan Muniz',
						street: 'Av Nova independencia',
						number: 37,
						complement: 'Apto 113',
						neighborhood: 'brooklyn novo',
						city: 'São Paulo',
						state: 'SP',
						zipcode: '04570000',
						addressName: 'Casa'
					}
				}
			}).catch(function(result) {
				console.log(result);
				result.should.be.a('object');

				done();
			});
		});

	});

});