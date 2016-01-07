'use strict';

var errorHelper = require('./helper'),
productsAPI = {

	coreAPI: false,

	init: function(coreAPI) {
		productsAPI.coreAPI = coreAPI;
		return productsAPI;
	},

	getFullCatalog: function() {
		return productsAPI.coreAPI.makeRequest('GET', 'product').then(function(xmlBody) {
			var productsArray = [];

			xmlBody.products.product.forEach((el) => {
				el.images = el.images.image;

				if(el.secondaryCategories) {
					console.log(Object.keys(el.secondaryCategories))
					el.secondaryCategories = el.secondaryCategories.category;
				}

				el.salePrice = (parseFloat(el.salePrice) || 0);
				el.defaultPrice = (parseFloat(el.defaultPrice) || 0);

				if(el.dateCreated !== '') {
					el.dateCreated = new Date(el.dateCreated);
				}

				if(el.lastUpdated !== '') {
					el.lastUpdated = new Date(el.lastUpdated);
				}

				if(!Array.isArray(el.sku)) {
					el.sku = [el.sku];
				}

				el.sku.forEach((thisSKu, index) => {
					el.sku[index].salePrice = (parseFloat(thisSKu.salePrice) || 0);
					el.sku[index].defaultPrice = (parseFloat(thisSKu.defaultPrice) || 0);
				});


				productsArray.push(el);
			});

			return {
				total: xmlBody.products['$'].count,
				offset: xmlBody.products['$'].offset,
				products: productsArray
			};
		});
	}

};

module.exports = Object.create(productsAPI);