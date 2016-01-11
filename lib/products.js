'use strict';

var errorHelper = require('./helper'),
	coreAPI,
productsAPI = {

	init(coreAPIObj) {
		coreAPI = coreAPIObj;
		return productsAPI;
	},

	parseProduct(productObj) {
		var productsArray = [];

		if(!Array.isArray(productObj)) {
			productObj = [ productObj ];
		}

		productObj.forEach((el) => {
			el.images = el.images.image;

			if(el.secondaryCategories) {
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
				el.sku = [ el.sku ];
			}

			if(el.productInfo) {
				el.productInfo = productsAPI.parseProductInfo(el.productInfo);
			}

			el.sku.forEach((thisSKu, index) => {
				el.sku[index].salePrice = (parseFloat(thisSKu.salePrice) || 0);
				el.sku[index].defaultPrice = (parseFloat(thisSKu.defaultPrice) || 0);
			});

			productsArray.push(el);
		});

		return productsArray;
	},

	parseProductInfo(productInfo) {
		productInfo = productInfo.group;
		if(!Array.isArray(productInfo)) {
			productInfo = [ productInfo ];
		}

		productInfo.forEach((thisInfo, index) => {
			if(!thisInfo.info) {
				delete productInfo[index];
				return;
			}

			if(!Array.isArray(thisInfo.info)) {
				productInfo[index].info = [ thisInfo.info ];
			}

			productInfo[index].info.forEach((thisTech, infoIndex) => {
				var propName = thisTech.property;

				if(thisInfo.name === 'ITEMSTATUS') {
					delete productInfo[index].info[infoIndex];
					return;
				}

				if(thisInfo.name === 'Informações Técnicas') {
					propName = propName.replace('InformacoesTecnicas_', '');
				}

				if(thisInfo.name === 'Características') {
					propName = propName.replace('Caracteristicas_', '');
				}

				if(thisInfo.name === 'Caracteristícas Gerais') {
					propName = propName.replace('CaracteristicasGerais_', '');
				}

				if(thisInfo.name === 'Grupo SKU') {
					propName = propName.replace('GrupoSku_', '');
				}

				productInfo[index].info[infoIndex].property = propName
					.replace(/([A-Z])/mg, ' $1')
					.replace('kg', '')
					.replace('xccm', '')
					.replace('cm', '')
					.replace('cm Axlxp', '')
					.trim();
			});
		});

		return productInfo;
	},

	getCatalog(page, limit) {
		if(!page) {
			page = 0;
		}

		if(!limit) {
			limit = 100;
		}

		return coreAPI
			.makeRequest('GET', 'product', {
				offset: page * limit,
				showInfo: true,
				max: limit
			})
			.then((xmlBody) => {
				let productsArray = productsAPI.parseProduct(xmlBody.products.product);

				return {
					total: parseInt(xmlBody.products.$.count, 10),
					itensPerPage: limit,
					totalPages: Math.ceil(xmlBody.products.$.count / limit),
					offset: parseInt(xmlBody.products.$.offset, 10),
					products: productsArray
				};
			});
	},

	getCatalogByLastUpdate(dateInHours, page, limit) {
		if(!dateInHours) {
			return errorHelper.errorHandler('products', 'invalidDate');
		}

		if(!page) {
			page = 0;
		}

		if(!limit) {
			limit = 100;
		}

		return coreAPI
			.makeRequest('GET', 'updatedProducts', {
				offset: page * limit,
				showInfo: true,
				lastUpdated: dateInHours,
				max: limit
			})
			.then((xmlBody) => {
				let productsArray = productsAPI.parseProduct(xmlBody.products.product);

				return {
					total: parseInt(xmlBody.products.$.count, 10),
					itensPerPage: limit,
					totalPages: Math.ceil(xmlBody.products.$.count / limit),
					offset: parseInt(xmlBody.products.$.offset, 10),
					products: productsArray
				};
			});
	},

	getProduct(productId) {
		if(!productId) {
			return errorHelper.errorHandler('products', 'missingId');
		}

		return coreAPI
			.makeRequest('GET', 'product/' + productId, { showInfo: true })
			.catch((error) => {
				if(error.err.statusCode === 404) {
					return errorHelper.errorHandler('products', 'productNotFound');
				}

				return error;
			})
			.then((xmlBody) => {
				delete xmlBody.product.$;

				let productsArray = productsAPI.parseProduct(xmlBody.product);
				return productsArray[0];
			});

	},

	getProductsByCategory(categoryId, page, limit) {
		if(!categoryId) {
			return errorHelper.errorHandler('products', 'missingId');
		}

		if(!page) {
			page = 0;
		}

		if(!limit) {
			limit = 100;
		}

		return coreAPI
			.makeRequest('GET', 'product', {
				category: categoryId,
				max: limit,
				offset: page * limit,
				showInfo: true
			})
			.catch((error) => {
				if(error.err.statusCode === 404) {
					return errorHelper.errorHandler('products', 'categoryNotFound');
				}

				return error;
			})
			.then((xmlBody) => {
				let productsArray = productsAPI.parseProduct(xmlBody.products.product);

				return {
					total: parseInt(xmlBody.products.$.count, 10),
					itensPerPage: limit,
					totalPages: Math.ceil(xmlBody.products.$.count / limit),
					offset: parseInt(xmlBody.products.$.offset, 10),
					products: productsArray
				};
			});
	},

	getSkus(skuList) {
		if(!skuList) {
			return errorHelper.errorHandler('products', 'missingIds');
		}

		if(!Array.isArray(skuList)) {
			skuList = [ skuList ];
		}

		return coreAPI
			.makeRequest('GET', 'product/skus', {
				skuList: skuList.toString(),
				showInfo: true,
				max: skuList.length
			})
			.catch((error) => {
				if(error.err.statusCode === 404) {
					return errorHelper.errorHandler('products', 'skuNotFound');
				}

				return error;
			})
			.then((xmlBody) => {
				let productsArray = productsAPI.parseProduct(xmlBody.products.product);

				return {
					total: parseInt(xmlBody.products.$.count, 10),
					products: productsArray
				};
			});
	},

	getSkuAvailability(skuId) {
		if(!skuId) {
			return errorHelper.errorHandler('products', 'missingId');
		}

		return coreAPI
			.makeRequest('GET', 'product/availability/' + skuId)
			.catch((error) => {
				if(error.err.statusCode === 404) {
					return errorHelper.errorHandler('products', 'skuNotFound');
				}

				return error;
			})
			.then((xmlBody) => {
				delete xmlBody.product.$;

				xmlBody.product.salePrice = (parseFloat(xmlBody.product.salePrice) || 0);
				xmlBody.product.defaultPrice = (parseFloat(xmlBody.product.defaultPrice) || 0);
				return xmlBody.product;
			});
	}

};

module.exports = Object.create(productsAPI);
