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

		if(!skuObj || (!skuObj.id && !skuObj.similar)) {
			return errorHelper.errorHandler('tracking', 'missingSku');
		}

		switch (paymentType) {
			case 'corporate':
				paymentObj = { type: 'CORPORATE_SALE_PAYMENT' };
				break;
			default:
				paymentObj = {
					type: 'CREDIT_CARD',
					cardBrand: paymentType.toUpperCase()
				};
				break;
		}

		cartObj.orderLines.orderLine = {
			sku: (skuObj.id || skuObj.similar),
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
			.catch((error) => errorHelper.errorHandler('tracking', error.erro.errorCode, error))
			.then((xmlBody) => {
				var freteObj = xmlBody.freight,
					dateArray = freteObj.time.split('-'),
					deliveryDates = [];

				deliveryDates = freteObj.scheduledDelivery.
					scheduledDeliveryAvailableDates.scheduledDeliveryAvailableDate.map((el) => {
						var dateArray = el.split('-');
						return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
					});

				return {
					deliveryDate: new Date(dateArray[0], dateArray[1] - 1, dateArray[2]),
					scheduledDelivery: {
						dates: deliveryDates,
						value: parseFloat(freteObj.scheduledDelivery.scheduledDeliveryAmount),
						periods: freteObj.scheduledDelivery.scheduledDeliveryPeriod.replace(/[\[\]\s]/gm, '').split(',')
					},
					value: parseFloat(freteObj.amount),
					discount: (parseFloat(freteObj.discount) || 0),
					total: parseFloat(freteObj.totalAmount)
				};

			});

	}

};

module.exports = Object.create(trackingAPI);
