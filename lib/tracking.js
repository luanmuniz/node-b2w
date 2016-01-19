'use strict';

var errorHelper = require('./helper'),
	coreAPI,
trackingAPI = {

	init(coreAPIObj) {
		coreAPI = coreAPIObj;
		return trackingAPI;
	},

	getTrackingInfo(zipCode, paymentType, skuObj, cupom) {
		var cartObj = { orderLines: {} },
			paymentObj;

		if(!zipCode || zipCode.length !== 8) {
			return errorHelper.errorHandler('tracking', 'missingZipCode');
		}

		if(!paymentType) {
			return errorHelper.errorHandler('tracking', 'missingPayment');
		}

		if(!skuObj || !skuObj.id) {
			return errorHelper.errorHandler('tracking', 'missingSku');
		}

		switch (paymentType) {
			case 'corporate':
				paymentObj = { type: 'CORPORATE_SALE_PAYMENT' };
				break;
			default:
				paymentObj = {
					type: 'CREDIT_CARD',
					cardBrand: paymentType
				};
				break;
		}

		cartObj.orderLines.orderLine = {
			sku: skuObj.id,
			quantity: (skuObj.quantity || 1)
		};

		if(skuObj.similar) {
			delete cartObj.orderLines.orderLine.sku;
			cartObj.orderLines.orderLine.similarId = skuObj.similar;
		}

		if(cupom) {
			cartObj.cupom = cupom;
		}

		return coreAPI
			.makeRequest('POST', 'freight', {}, coreAPI.parseXML({
				addresses: { shipping: { zipcode: zipCode } },
				payments: { payment: paymentObj },
				cart: cartObj
			}))
			.catch((error) => {
				// Aguardando retorno da issue #2
				throw error.err;
			})
			.then((xmlBody) => {
				var freteObj = xmlBody.freight,
					dateArray = freteObj.time.split('-');

				return {
					etd: new Date(dateArray[0], dateArray[1] - 1, dateArray[2]),
					value: parseFloat(freteObj.amount),
					discount: (parseFloat(freteObj.discount) || 0),
					total: parseFloat(freteObj.totalAmount)
				};

			});

	}

};

module.exports = Object.create(trackingAPI);
