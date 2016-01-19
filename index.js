'use strict';

var coreAPI = require('./lib/core'),
	productsAPI = require('./lib/products'),
	orderAPI = require('./lib/order'),
	trackingAPI = require('./lib/tracking'),
	categoryAPI = require('./lib/category');

module.exports = function(keys, env) {
	var apiObj = {};

	apiObj.coreAPI = coreAPI.init(keys, env);
	apiObj.products = productsAPI.init(coreAPI);
	apiObj.order = orderAPI.init(coreAPI);
	apiObj.tracking = trackingAPI.init(coreAPI);
	apiObj.categories = categoryAPI.init(coreAPI);

	return apiObj;
};