'use strict';

var errorHelper = require('./helper'),
	orderHelper = require('./orderHelper'),
	coreAPI,
orderAPI = {

	init(coreAPIObj) {
		coreAPI = coreAPIObj;
		return orderAPI;
	},

	getOrder(orderId) {
		if(!orderId) {
			return errorHelper.errorHandler('order', 'missingId');
		}

		return coreAPI
			.makeRequest('GET', 'order/' + orderId)
			.catch((error) => {
				if(error.err.statusCode === 404) {
					return errorHelper.errorHandler('order', 'orderNotFound');
				}

				return error;
			})
			.then((xmlBody) => {
				return orderHelper.parseOrderObj(xmlBody);
			});
	},

	trackOrder(orderId) {
		if(!orderId) {
			return errorHelper.errorHandler('order', 'missingId');
		}
	},

	getOrderStatus(orderId) {
		if(!orderId) {
			return errorHelper.errorHandler('order', 'missingId');
		}
	},

	createOrder(orderObj) {
		if(!orderObj) {
			return errorHelper.errorHandler('order', 'missingParams');
		}

		return orderHelper.checkEachParam(orderObj)
			.then(() => {
				return coreAPI.makeRequest('GET', 'order', orderObj);
			})
			.catch((error) => {
				if(error.err) {
					return errorHelper.errorHandler('core', 'requestError');
				}

				return error;
			})
			.then((xmlBody) => {
				console.log(xmlBody);
			});
	}

};

module.exports = Object.create(orderAPI);
