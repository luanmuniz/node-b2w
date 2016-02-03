'use strict';

var xml2js = require('xml2js'),
	parser = xml2js.Parser({
		explicitArray: false,
		valueProcessors: [ function(value) {
			if(value.toLowerCase() === 'false' || value.toLowerCase() === 'true') {
				return (value.toLowerCase() === 'true');
			}

			return value.trim();
		} ]
	}),
	coreApi = require('../../lib/core').init({
		symbol: 'symbolTest',
		company: 'americanas',
		login: 'loginTest',
		password: 'passwordTest'
	}),
mockHelper = {

	makeRequest(method, uri, params, body) {
		var fs = require('fs'),
			fileBody, calledXML;

		if(uri == 'product/321') {
			return Promise.reject({
				error: { statusCode: 404 },
				erro: { statusCode: 404 }
			});
		}

		if(uri == 'product/3211') {
			return Promise.reject({
				error: { statusCode: 401 }
			});
		}

		if(uri == 'product' && params.category === 321) {
			return Promise.reject({
				error: { statusCode: 404 },
				erro: { statusCode: 404 }
			});
		}

		if(uri == 'product' && params.category === 3211) {
			return Promise.reject({
				error: { statusCode: 401 }
			});
		}

		if(uri == 'product/skus' && params.skuList === '987') {
			return Promise.reject({
				error: { statusCode: 404 },
				erro: { statusCode: 404 }
			});
		}

		if(uri == 'product/skus' && params.skuList === '789') {
			return Promise.reject({
				error: { statusCode: 401 }
			});
		}

		if(uri == 'product/availability/321') {
			return Promise.reject({
				error: { statusCode: 404 },
				erro: { statusCode: 404 }
			});
		}

		if(uri == 'product/availability/3211') {
			return Promise.reject({
				error: { statusCode: 401 }
			});
		}

		if(uri == 'order/321') {
			return Promise.reject({
				statusCode: 404,
				error: { error_message: 'hi', error_code: 404 },
				erro: { statusCode: 404 }
			});
		}

		if(uri == 'order/3211') {
			return Promise.reject({
				statusCode: 401,
				error: { error_message: 'hi', error_code: '9000' },
				erro: { statusCode: '9000' }
			});
		}

		if(uri == 'freight' && body === '12345678') {
			return Promise.reject({
				statusCode: 401,
				error: { error_message: 'hi', error_code: '9000' },
				erro: { statusCode: '9000', errorCode: '9000' }
			});
		}

		if(uri === 'order' && body.orderServiceId === '321') {
			return Promise.reject({
				statusCode: 404,
				error: { error_message: 'hi', error_code: 404 },
				erro: { statusCode: 404 }
			});
		}

		switch(uri) {
			case 'product':
			case 'updatedProducts':
			case 'product/skus':
				calledXML = 'catalog.xml';
				break;
			case 'product/123':
				calledXML = 'product.xml';
				break;
			case 'product/availability/123':
				calledXML = 'availability.xml';
				break;
			case 'product/availability/1':
				calledXML = 'availability-zero.xml';
				break;
			case 'category':
				calledXML = 'category.xml';
				break;
			case 'category/file':
				calledXML = 'category.xml';
				break;
			case 'freight':
				calledXML = 'freight.xml';
				break;
			case 'order/123':
				calledXML = 'get-order.xml';
				break;
			case 'order/1234':
				calledXML = 'get-order-single.xml';
				break;
			case 'order':
				calledXML = 'create-order.xml';
				break;
		}

		if(uri === 'order' && body.orderServiceId === '123') {
			calledXML = 'create-order-single.xml';
		}

		fileBody = fs.readFileSync(__dirname + '/' + calledXML, 'utf8');
		return mockHelper.parseResponse({
			body: fileBody
		});
	},

	parseResponse: coreApi.parseResponse,
	rootUrl: coreApi.rootUrl,
	parseXML(obj) {
		if(obj.orderServiceId) {
			return obj;
		}

		return obj.addresses.shipping.zipcode;
	}

};

module.exports = mockHelper;