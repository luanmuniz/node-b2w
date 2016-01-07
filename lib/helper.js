'use strict';

var errorAPI = {

	errorObj: {
		core: {
			requestError: 'Request Error',
			missingCredentials: 'You need to pass your credentials to initialize the module'
		},

		products: {
			missingId: 'You need to pass a valid id',
			missingIds: 'You need to pass a valid array of id',
			productNotFound: 'Product not found',
			categoryNotFound: 'Category not found',
			skuNotFound: 'Sku not found',
			invalidDate: 'You need to pass a valid date'
		}
	},

	errorHandler: function(section, code, err) {
		var returnedError = { success: false },
			message = 'Error Unknow';

		if(errorAPI.errorObj[section][code]) {
			message = errorAPI.errorObj[section][code];
		}

		returnedError.code = code;
		returnedError.message = message;

		console.log(err);
		if(err) {
			returnedError.err = err;
		}

		return Promise.reject(returnedError);
	}

};

module.exports = Object.create(errorAPI);
