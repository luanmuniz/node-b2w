'use strict';

var coreApi = require('../../lib/core').init({
	symbol: 'symbolTest',
	company: 'Americanas',
	login: 'loginTest',
	password: 'passwordTest'
}),
mockHelper = {

	makeRequest(method, uri, params) {
		var fs = require('fs'),
			fileBody, calledXML;

		if(uri == 'product/321') {
			return Promise.reject({
				err: { statusCode: 404 }
			});
		}

		if(uri == 'product/3211') {
			return Promise.reject({
				err: { statusCode: 401 }
			});
		}

		if(uri == 'product' && params.category === 321) {
			return Promise.reject({
				err: { statusCode: 404 }
			});
		}

		if(uri == 'product' && params.category === 3211) {
			return Promise.reject({
				err: { statusCode: 401 }
			});
		}

		if(uri == 'product/skus' && params.skuList === '987') {
			return Promise.reject({
				err: { statusCode: 404 }
			});
		}

		if(uri == 'product/skus' && params.skuList === '789') {
			return Promise.reject({
				err: { statusCode: 401 }
			});
		}

		if(uri == 'product/availability/321') {
			return Promise.reject({
				err: { statusCode: 404 }
			});
		}

		if(uri == 'product/availability/3211') {
			return Promise.reject({
				err: { statusCode: 401 }
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
		}

		fileBody = fs.readFileSync(__dirname + '/' + calledXML, 'utf8');
		return mockHelper.parseResponse({
			body: fileBody
		});
	},

	parseResponse: coreApi.parseResponse,
	rootUrl: coreApi.rootUrl

};

module.exports = mockHelper;