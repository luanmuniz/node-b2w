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

	errorHandler: function(section, code, err, throwError) {
		var returnedError = { sucess: false },
			message = 'Error Unknow';

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
