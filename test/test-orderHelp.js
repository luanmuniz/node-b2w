'use strict';

var should = require('chai').should(),
	lib = require('../lib/orderHelper'),
	libCore = require('../lib/core'),
	orderObj = {};

describe('orderHelper', function() {

	function testOrder(originalObj, result, done) {
		result.should.be.a('string');

		libCore.parseResponse({ body: result })
			.then(function(parsedResult) {
				parsedResult.should.be.a('object');
				parsedResult.should.have.property('order').that.is.a('object');

				parsedResult.order.should.have.property('orderServiceId').that.is.a('string');
				parsedResult.order.should.have.property('cart').that.is.a('object');
				parsedResult.order.should.have.property('customer').that.is.a('object');
				parsedResult.order.should.have.property('addresses').that.is.a('object');
				parsedResult.order.should.have.property('payments').that.is.a('object');

				parsedResult.order.cart.should.have.property('orderLines').that.is.a('object');
				parsedResult.order.cart.orderLines.should.have.property('orderLine');
				parsedResult.order.cart.should.have.property('freight').that.is.a('object');
				parsedResult.order.cart.freight.should.have.property('time').that.is.a('string');
				parsedResult.order.cart.freight.should.have.property('amount').that.is.a('string');
				parsedResult.order.cart.freight.should.have.property('discount').that.is.a('string');
				parsedResult.order.cart.freight.should.have.property('totalAmount').that.is.a('string');

				parsedResult.order.customer.should.have.property('email').that.is.a('string');
				parsedResult.order.customer.should.have.property('type').that.is.a('string');
				parsedResult.order.customer.should.have.property('documentNumber').that.is.a('string');
				parsedResult.order.customer.should.have.property('name').that.is.a('string');
				parsedResult.order.customer.should.have.property('nickName').that.is.a('string');
				parsedResult.order.customer.should.have.property('phones').that.is.a('object');
				parsedResult.order.customer.phones.should.have.property('residentialPhone').that.is.a('object');
				parsedResult.order.customer.phones.residentialPhone.should.have.property('areaCode').that.is.a('string');
				parsedResult.order.customer.phones.residentialPhone.should.have.property('number').that.is.a('string');

				if(originalObj.address.shipping) {
					parsedResult.order.addresses.should.have.property('shipping').that.is.a('object');
					parsedResult.order.addresses.shipping.should.have.property('contactName').that.is.a('string');
					parsedResult.order.addresses.shipping.should.have.property('address').that.is.a('string');
					parsedResult.order.addresses.shipping.should.have.property('number').that.is.a('string');
					parsedResult.order.addresses.shipping.should.have.property('complement').that.is.a('string');
					parsedResult.order.addresses.shipping.should.have.property('province').that.is.a('string');
					parsedResult.order.addresses.shipping.should.have.property('city').that.is.a('string');
					parsedResult.order.addresses.shipping.should.have.property('state').that.is.a('string');
					parsedResult.order.addresses.shipping.should.have.property('zipcode').that.is.a('string');
					parsedResult.order.addresses.shipping.should.have.property('addressName').that.is.a('string');
				}

				if(Array.isArray(originalObj.user.phones)) {
					if(originalObj.user.phones[1].ramal) {
						parsedResult.order.customer.phones.residentialPhone.should.have.property('ramal').that.is.a('string');
					}
				}

				if(originalObj.user.optin) {
					parsedResult.order.customer.should.have.property('optin').that.is.a('boolean');
				}

				if(originalObj.address.billing) {
					parsedResult.order.addresses.should.have.property('billing').that.is.a('object');
					parsedResult.order.addresses.billing.should.have.property('contactName').that.is.a('string');
					parsedResult.order.addresses.billing.should.have.property('address').that.is.a('string');
					parsedResult.order.addresses.billing.should.have.property('number').that.is.a('string');
					parsedResult.order.addresses.billing.should.have.property('complement').that.is.a('string');
					parsedResult.order.addresses.billing.should.have.property('province').that.is.a('string');
					parsedResult.order.addresses.billing.should.have.property('city').that.is.a('string');
					parsedResult.order.addresses.billing.should.have.property('state').that.is.a('string');
					parsedResult.order.addresses.billing.should.have.property('zipcode').that.is.a('string');
					parsedResult.order.addresses.billing.should.have.property('addressName').that.is.a('string');
				}

				if(originalObj.address.type === 'creditcard') {
					parsedResult.order.payments.should.have.property('creditCard');
					parsedResult.order.payments.creditCard.should.have.property('cardBrand').that.is.a('string');
					parsedResult.order.payments.creditCard.should.have.property('cardOwnerName').that.is.a('string');
					parsedResult.order.payments.creditCard.should.have.property('cardNumber').that.is.a('string');
					parsedResult.order.payments.creditCard.should.have.property('cardExpirationDate').that.is.a('string');
					parsedResult.order.payments.creditCard.should.have.property('parcels').that.is.a('string');
					parsedResult.order.payments.creditCard.should.have.property('totalAmount').that.is.a('string');
				}

				if(originalObj.address.type === 'corporate') {
					parsedResult.order.payments.should.have.property('corporateSalePayment').that.is.a('object');
					parsedResult.order.payments.corporateSalePayment.should.have.property('cnpj').that.is.a('string');
					parsedResult.order.payments.corporateSalePayment.should.have.property('totalAmount').that.is.a('string');
				}

				done();
			});
	}

	beforeEach(function(done) {
		orderObj = {
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
		};

		done();
	});

	describe('FomatDate', function() {
		it('formatDate()', function(done) {
			lib.checkEachParam(orderObj).then(function() {
				var formatedDate = lib.formatDate( (new Date(2015, 1, 1)) );
				formatedDate.should.be.equal('2015-02-01');
				done();
			});
		});

		it('formatDate() with big dates', function(done) {
			lib.checkEachParam(orderObj).then(function() {
				var formatedDate = lib.formatDate( (new Date(2015, 10, 15)) );
				formatedDate.should.be.equal('2015-11-15');
				done();
			});
		});
	});

	describe('Parser Order Object', function() {
		it('parseOrderObj()', function(done) {
			lib.checkEachParam(orderObj).then(function() {
				var formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});

		it('parseOrderObj() with Referer and Cupom', function(done) {
			var formatedObj;
			orderObj.referer = '123';
			orderObj.cupom = '123';
			lib.checkEachParam(orderObj).then(function() {
				formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});

		it('parseOrderObj() with Delivery option', function(done) {
			var formatedObj;
			orderObj.tracking.type = 'delivery';
			orderObj.tracking.deliveryPeriod = 'MANHA';
			orderObj.tracking.value = 2;
			orderObj.tracking.discount = 1;
			orderObj.tracking.total = 1;
			lib.checkEachParam(orderObj).then(function() {
				formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});

		it('parseOrderObj() with SKU as Object and Similar', function(done) {
			var formatedObj;
			orderObj.sku = { similar: '123', price: 123.12, quantity: 2 };
			lib.checkEachParam(orderObj).then(function() {
				formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});

		it('parseOrderObj() with User type as PJ', function(done) {
			var formatedObj;
			orderObj.user.type = 'pj';
			orderObj.user.corporateName = 'test';
			orderObj.user.stateRegistration = 'test';
			orderObj.user.purposePurchasing = 'RESALE';
			orderObj.user.taxInformation = 'TAXPAYER_ICMS';
			lib.checkEachParam(orderObj).then(function() {
				formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});

		it('parseOrderObj() with only one phone', function(done) {
			var formatedObj;
			orderObj.user.phones = { type: 'residential', ddd: 11, number: 33325698, ramal: 123 };
			lib.checkEachParam(orderObj).then(function() {
				formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});

		it('parseOrderObj() with only one phone', function(done) {
			var formatedObj;
			orderObj.user.phones = [{ type: 'comercial', ddd: 11, number: 33325698, ramal: 123 }, { type: 'residential', ddd: 11, number: 33325698, ramal: 123 }];
			lib.checkEachParam(orderObj).then(function() {
				formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});

		it('parseOrderObj() with optin', function(done) {
			var formatedObj;
			orderObj.user.optin = true;
			lib.checkEachParam(orderObj).then(function() {
				formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});

		it('parseOrderObj() with billing address', function(done) {
			var formatedObj;
			orderObj.address.billing = {
				contactName: 'Luan Muniz',
				street: 'Av Nova independencia',
				number: 37,
				complement: 'Apto 113',
				neighborhood: 'brooklyn novo',
				city: 'São Paulo',
				state: 'SP',
				zipcode: '04570000',
				addressName: 'Casa'
			};
			lib.checkEachParam(orderObj).then(function() {
				formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});

		it('parseOrderObj() with creditcard', function(done) {
			var formatedObj;
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/17',
				cvv: '153'
			};
			lib.checkEachParam(orderObj).then(function() {
				formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});

		it('parseOrderObj() with creditcard and full year', function(done) {
			var formatedObj;
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/2017',
				cvv: '153'
			};
			lib.checkEachParam(orderObj).then(function() {
				formatedObj = lib.parseOrderObj(orderObj, libCore);
				testOrder(orderObj, formatedObj, done);
			});
		});
	});

	describe('Generic Object validation', function() {
		it('checkEachParam()', function(done) {
			lib.checkEachParam(orderObj).then(function(result) {
				result.should.be.equal(true);
				done();
			})
		});

		it('checkEachParam() without partnetId', function(done) {
			delete orderObj.partnerId;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingPartnerId');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkEachParam() without skuObj', function(done) {
			delete orderObj.sku;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingSkuInfo');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkEachParam() without userObj', function(done) {
			delete orderObj.user;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserInfo');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkEachParam() without trackingObj', function(done) {
			delete orderObj.tracking;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingTrackingInfo');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkEachParam() without paymentObj', function(done) {
			delete orderObj.payment;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingPaymentInfo');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkEachParam() without addressObj', function(done) {
			delete orderObj.address;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingAddressInfo');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});
	});

	describe('Use Object validation', function() {
		it('checkUserParam() without user.email', function(done) {
			delete orderObj.user.email;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserEmail');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with invalid user.email', function(done) {
			orderObj.user.email = 'asd';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserEmail');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with optin', function(done) {
			orderObj.user.optin = 'asd';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserOptin');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without type', function(done) {
			delete orderObj.user.type;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserType');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with invalid type', function(done) {
			orderObj.user.type = 'asd';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserType');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without nickname', function(done) {
			delete orderObj.user.nickname;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserNickname');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with invalid nickname for less length', function(done) {
			orderObj.user.nickname = 'ad';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserNickname');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with invalid nickname for more length', function(done) {
			orderObj.user.nickname = 'asdasdasdasdasdasdadas';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserNickname');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without pf birthdate', function(done) {
			delete orderObj.user.birthdate;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserBirthdate');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with invalid pf birthdate', function(done) {
			orderObj.user.birthdate = 'asd';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserBirthdate');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with invalid pf gender', function(done) {
			delete orderObj.user.gender;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserGender');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with invalid pf birthdate', function(done) {
			orderObj.user.gender = 'asdasd';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserGender');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with out PJ corporateName', function(done) {
			orderObj.user.type = 'pj';
			orderObj.user.stateRegistration = 'test';
			orderObj.user.purposePurchasing = 'test';
			orderObj.user.taxInformation = 'test';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserCorporateName');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without PJ stateRegistration', function(done) {
			orderObj.user.type = 'pj';
			orderObj.user.corporateName = 'test';
			orderObj.user.purposePurchasing = 'test';
			orderObj.user.taxInformation = 'test';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserStateRegistration');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without PJ purposePurchasing', function(done) {
			orderObj.user.type = 'pj';
			orderObj.user.corporateName = 'test';
			orderObj.user.stateRegistration = 'test';
			orderObj.user.taxInformation = 'test';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserPurposePurchasing');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with invalid PJ purposePurchasing', function(done) {
			orderObj.user.type = 'pj';
			orderObj.user.corporateName = 'test';
			orderObj.user.stateRegistration = 'test';
			orderObj.user.purposePurchasing = 'test';
			orderObj.user.taxInformation = 'test';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserPurposePurchasing');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without PJ taxInformation', function(done) {
			orderObj.user.type = 'pj';
			orderObj.user.corporateName = 'test';
			orderObj.user.stateRegistration = 'test';
			orderObj.user.purposePurchasing = 'RESALE';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserTaxInformation');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with PJ user', function(done) {
			orderObj.user.type = 'pj';
			orderObj.user.corporateName = 'test';
			orderObj.user.stateRegistration = 'test';
			orderObj.user.purposePurchasing = 'RESALE';
			orderObj.user.taxInformation = 'test';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserTaxInformation');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() with valid PJ Obj', function(done) {
			orderObj.user.type = 'pj';
			orderObj.user.corporateName = 'test';
			orderObj.user.stateRegistration = 'test';
			orderObj.user.purposePurchasing = 'RESALE';
			orderObj.user.taxInformation = 'TAXPAYER_ICMS';
			lib.checkEachParam(orderObj).then(function(result) {
				result.should.be.equal(true);
				done();
			});
		});

		it('checkUserParam() without documentNumber', function(done) {
			delete orderObj.user.documentNumber;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserDocumentNumber');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without name', function(done) {
			delete orderObj.user.name;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserName');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without phones', function(done) {
			delete orderObj.user.phones;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserPhoneObject');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without residential phones', function(done) {
			orderObj.user.phones = { type: 'comercial', ddd: 21, number: 12345678 };
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingResidentialPhone');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without phones type', function(done) {
			orderObj.user.phones.push({ ddd: 123 });
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserPhoneType');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without valid phones type', function(done) {
			orderObj.user.phones.push({ type: 123 });
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserPhoneType');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without phones ddd', function(done) {
			orderObj.user.phones.push({ type: 'comercial' });
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserPhoneDDD');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without valid phones ddd', function(done) {
			orderObj.user.phones.push({ type: 'comercial', ddd: 1 });
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserPhoneDDD');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without phones number', function(done) {
			orderObj.user.phones.push({ type: 'comercial', ddd: 21 });
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingUserPhoneNumber');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkUserParam() without valid phones number', function(done) {
			orderObj.user.phones.push({ type: 'comercial', ddd: 21, number: 'asdasdas' });
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidUserPhoneNumber');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});
	});

	describe('Sku Object validation', function() {
		it('checkSkuParam() without id', function(done) {
			orderObj.sku = {};
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingSkuIdOrSimilar');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkSkuParam() without price', function(done) {
			orderObj.sku = { id: 123 };
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingSkuPrice');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkSkuParam() with invalid price', function(done) {
			orderObj.sku = { id: 123, price: 'asd' };
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidSkuPrice');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkSkuParam() with invalid quantity', function(done) {
			orderObj.sku = { id: 123, price: '123', quantity: 'a' };
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidSkuQuantity');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});
	});

	describe('Tracking Object validation', function() {

		it('checkTrackingParam() with no valid deliveryDate', function(done) {
			delete orderObj.tracking.deliveryDate;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingTrackingDeliveryDate');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkTrackingParam() with invalid deliveryDate', function(done) {
			orderObj.tracking.deliveryDate = '123';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidTrackingDeliveryDate');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkTrackingParam() with no valid value', function(done) {
			delete orderObj.tracking.value;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingTrackingValue');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkTrackingParam() with invalid value', function(done) {
			orderObj.tracking.value = 'asd';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidTrackingValue');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkTrackingParam() with no valid total', function(done) {
			delete orderObj.tracking.total;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingTrackingTotal');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkTrackingParam() with invalid total', function(done) {
			orderObj.tracking.total = 'asd';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidTrackingTotal');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkTrackingParam() with invalid discount', function(done) {
			orderObj.tracking.value = 2;
			orderObj.tracking.discount = 2;
			orderObj.tracking.total = 1;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidTrackingPricing');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkTrackingParam() with delivery and no valid deliveryPeriod', function(done) {
			orderObj.tracking.type = 'delivery';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingTrackingDeliveryPeriod');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkTrackingParam() with invalid deliveryPeriod', function(done) {
			orderObj.tracking.type = 'delivery';
			orderObj.tracking.deliveryPeriod = 'asdas';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidTrackingDeliveryPeriod');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

	});

	describe('Payment Object validation', function() {
		it('checkPaymentParam() without type', function(done) {
			delete orderObj.payment.type;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingPaymentType');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() with invalid type', function(done) {
			orderObj.payment.type = 'asd';
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidPaymentType');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() without cnpj for corporate', function(done) {
			orderObj.payment.type = 'corporate';
			delete orderObj.payment.cnpj;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingPaymentCNPJ');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() without cardBrand for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/17',
				cvv: '153'
			};

			delete orderObj.payment.cardBrand;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingPaymentCardBrand');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() with invalid cardBrand for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'sdasdasdasdas',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/17',
				cvv: '153'
			};

			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidPaymentCardBrand');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() without cardOwnerName for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/17',
				cvv: '153'
			};

			delete orderObj.payment.cardOwnerName;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingPaymentCardOwnerName');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() without cardNumber for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/17',
				cvv: '153'
			};

			delete orderObj.payment.cardNumber;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingPaymentCardNumber');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() with invalid cardNumber for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '0',
				cardExpirationDate: '03/17',
				cvv: '153'
			};

			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidPaymentCardNumber');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() without cardExpirationDate for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/17',
				cvv: '153'
			};

			delete orderObj.payment.cardExpirationDate;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingPaymentCardCardExpirationDate');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() with invalid month in cardExpirationDate for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '15/17',
				cvv: '153'
			};

			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidPaymentExpiryMonth');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() with invalid year in cardExpirationDate for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/912',
				cvv: '153'
			};

			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidPaymentExpiryYear');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() with expired cardExpirationDate for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/12',
				cvv: '153'
			};

			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidPaymentExpireDate');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() without cvv for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/17',
				cvv: '153'
			};

			delete orderObj.payment.cvv;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingPaymentCardCvv');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

		it('checkPaymentParam() with invalid cvv for creditCard', function(done) {
			orderObj.payment = {
				type: 'creditcard',
				cardBrand: 'visa',
				cardOwnerName: 'Luan Muniz',
				cardNumber: '4111111111111111',
				cardExpirationDate: '03/12',
				cvv: '2313213132132'
			};

			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('invalidPaymentCvv');
				result.should.have.property('message').that.is.a('string');

				done();
			});
		});

	});

	describe('Address Object validation', function() {
		it('checkAddressParam() without shipping', function(done) {
			delete orderObj.address.shipping;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingAddressShipping');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without shipping.contactName', function(done) {
			delete orderObj.address.shipping.contactName;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingAddressContactName');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without shipping.street', function(done) {
			delete orderObj.address.shipping.street;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingAddressStreet');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without shipping.number', function(done) {
			delete orderObj.address.shipping.number;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingAddressNumber');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without shipping.neighborhood', function(done) {
			delete orderObj.address.shipping.neighborhood;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingAddressNeighborhood');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without shipping.city', function(done) {
			delete orderObj.address.shipping.city;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingAddressCity');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without shipping.state', function(done) {
			delete orderObj.address.shipping.state;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingAddressState');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without shipping.zipcode', function(done) {
			delete orderObj.address.shipping.zipcode;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingAddressZipcode');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without shipping.addressName', function(done) {
			delete orderObj.address.shipping.addressName;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingAddressName');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without billing.contactName', function(done) {
			orderObj.address.billing = {
				contactName: 'Luan Muniz',
				street: 'Av Nova independencia',
				number: 37,
				complement: 'Apto 113',
				neighborhood: 'brooklyn novo',
				city: 'São Paulo',
				state: 'SP',
				zipcode: '04570000',
				addressName: 'Casa'
			};
			delete orderObj.address.billing.contactName;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingBillingAddressContactName');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without billing.street', function(done) {
			orderObj.address.billing = {
				contactName: 'Luan Muniz',
				street: 'Av Nova independencia',
				number: 37,
				complement: 'Apto 113',
				neighborhood: 'brooklyn novo',
				city: 'São Paulo',
				state: 'SP',
				zipcode: '04570000',
				addressName: 'Casa'
			};
			delete orderObj.address.billing.street;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingBillingAddressStreet');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without billing.number', function(done) {
			orderObj.address.billing = {
				contactName: 'Luan Muniz',
				street: 'Av Nova independencia',
				number: 37,
				complement: 'Apto 113',
				neighborhood: 'brooklyn novo',
				city: 'São Paulo',
				state: 'SP',
				zipcode: '04570000',
				addressName: 'Casa'
			};
			delete orderObj.address.billing.number;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingBillingAddressNumber');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without billing.neighborhood', function(done) {
			orderObj.address.billing = {
				contactName: 'Luan Muniz',
				street: 'Av Nova independencia',
				number: 37,
				complement: 'Apto 113',
				neighborhood: 'brooklyn novo',
				city: 'São Paulo',
				state: 'SP',
				zipcode: '04570000',
				addressName: 'Casa'
			};
			delete orderObj.address.billing.neighborhood;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingBillingAddressNeighborhood');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without billing.city', function(done) {
			orderObj.address.billing = {
				contactName: 'Luan Muniz',
				street: 'Av Nova independencia',
				number: 37,
				complement: 'Apto 113',
				neighborhood: 'brooklyn novo',
				city: 'São Paulo',
				state: 'SP',
				zipcode: '04570000',
				addressName: 'Casa'
			};
			delete orderObj.address.billing.city;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingBillingAddressCity');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without billing.state', function(done) {
			orderObj.address.billing = {
				contactName: 'Luan Muniz',
				street: 'Av Nova independencia',
				number: 37,
				complement: 'Apto 113',
				neighborhood: 'brooklyn novo',
				city: 'São Paulo',
				state: 'SP',
				zipcode: '04570000',
				addressName: 'Casa'
			};
			delete orderObj.address.billing.state;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingBillingAddressState');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without billing.zipcode', function(done) {
			orderObj.address.billing = {
				contactName: 'Luan Muniz',
				street: 'Av Nova independencia',
				number: 37,
				complement: 'Apto 113',
				neighborhood: 'brooklyn novo',
				city: 'São Paulo',
				state: 'SP',
				zipcode: '04570000',
				addressName: 'Casa'
			};
			delete orderObj.address.billing.zipcode;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingBillingAddressZipcode');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

		it('checkAddressParam() without billing.addressName', function(done) {
			orderObj.address.billing = {
				contactName: 'Luan Muniz',
				street: 'Av Nova independencia',
				number: 37,
				complement: 'Apto 113',
				neighborhood: 'brooklyn novo',
				city: 'São Paulo',
				state: 'SP',
				zipcode: '04570000',
				addressName: 'Casa'
			};
			delete orderObj.address.billing.addressName;
			lib.checkEachParam(orderObj).catch(function(result) {
				result.should.be.an('object');
				result.should.have.property('success').that.is.equal(false);
				result.should.have.property('code').that.is.equal('missingBillingAddressName');
				result.should.have.property('message').that.is.a('string');
				done();
			});
		});

	});

});