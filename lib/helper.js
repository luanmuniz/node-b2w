'use strict';

var errorAPI = {

	errorObj: {
		core: {
			requestError: 'Request Error',
			missingCredentials: 'You need to pass your credentials to initialize the module',
			companyNotFound: 'This company does not exist'
		},

		products: {
			missingId: 'You need to pass a valid id',
			missingIds: 'You need to pass a valid array of id',
			productNotFound: 'Product not found',
			categoryNotFound: 'Category not found',
			skuNotFound: 'Sku not found',
			invalidDate: 'You need to pass a valid date'
		},

		order: {
			missingId: 'You need to pass a valid id',
			orderNotFound: 'Order not found'
		},

		client: {
			missingId: 'You need to pass a valid id',
			clientNotFound: 'Client not found'
		},

		category: {
			missingId: 'You need to pass a valid id'
		},

		tracking: {
			missingZipCode: 'You need to pass a valid zipcode',
			missingPayment: 'You need to pass a valid payment type',
			missingSku: 'You need to pass a valid Sku'
		}
	},

	errorHandler: function(section, code, err, throwError) {
		var returnedError = { success: false },
			message = 'Unknown Error';

		if(errorAPI.errorObj.hasOwnProperty(section)) {
			if(errorAPI.errorObj[section].hasOwnProperty(code)) {
				message = errorAPI.errorObj[section][code];
			}
		}

		returnedError.code = code;
		returnedError.message = message;

		if(err) {
			returnedError.err = err;
		}

		if(throwError) {
			throw new Error(returnedError.message);
		}

		return Promise.reject(returnedError);
	}

};

module.exports = Object.create(errorAPI);
