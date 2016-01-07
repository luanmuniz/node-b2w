'use strict';

var Promise = (Promise || require('promise')),
errorAPI = {

	errorObj: {
		core: {
			0: 'Request Error',
			1: 'You need to pass your credentials to initialize the module'
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

		if(err) {
			delete err.response;
			returnedError.err = err;
		}

		return Promise.reject(returnedError.message);
	}

};

module.exports = Object.create(errorAPI);