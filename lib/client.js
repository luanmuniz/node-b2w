'use strict';

var errorHelper = require('./helper'),
	coreAPI,
clientAPI = {

	init(coreAPIObj) {
		coreAPI = coreAPIObj;
		return clientAPI;
	},

	getClientInfo(clientId) {
		if(!clientId) {
			return errorHelper.errorHandler('client', 'missingId');
		}

		return coreAPI
			.makeRequest('GET', 'customer/' + clientId)
			.catch((error) => {
				if(error.err.statusCode === 404) {
					return errorHelper.errorHandler('client', 'clientNotFound');
				}

				return error;
			})
			.then((xmlBody) => {
				// Aguardando issue #4
				return xmlBody.customer;
			});
	}

};

module.exports = Object.create(clientAPI);
