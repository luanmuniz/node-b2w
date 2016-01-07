'use strict';

var coreAPI = require('./lib/core'),
	productsAPI = require('./lib/products');

module.exports = function(keys, env) {
	var apiObj = {};

	coreAPI = coreAPI.init(keys, env);

	apiObj.products = productsAPI.init(coreAPI);

	return apiObj;
};