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
				if(error.erro.statusCode === 404) {
					return errorHelper.errorHandler('order', 'orderNotFound');
				}

				return error;
			})
			.then((xmlBody) => {
				var orderBody = xmlBody.order,
					etaArray = orderBody.cart.freight.time.split('-'),
					productArray = [];

				if(!Array.isArray(orderBody.cart.orderLines.orderLine)) {
					orderBody.cart.orderLines.orderLine = [ orderBody.cart.orderLines.orderLine ];
				}

				productArray = orderBody.cart.orderLines.orderLine.map((product) => {
					var productEtaArray = product.freight.time.split('-');

					return {
						productId: product.productId,
						skuId: product.skuId,
						name: product.name,
						isGift: product.gift,
						quantity: parseInt(product.quantity, 10),
						price: parseFloat(product.listPrice),
						finalPrice: parseFloat(product.salePrice),
						discount: parseFloat(product.discount),
						totalPrice: parseFloat(product.totalAmount),
						delivery: {
							eta: new Date(productEtaArray[0], productEtaArray[1], productEtaArray[2]),
							value: parseFloat(product.freight.amount),
							discount: parseFloat(product.freight.discount),
							total: parseFloat(product.freight.totalAmount)
						}
					};
				});

				return {
					id: orderBody.id,
					partnerId: orderBody.orderServiceId,
					creationDate: (new Date(orderBody.creationDate)),
					customer: {
						id: orderBody.customer.id,
						name: orderBody.customer.name
					},
					address: {
						shipping: {
							id: orderBody.addresses.shipping.id,
							contactName: orderBody.addresses.shipping.contactName,
							nickname: orderBody.addresses.shipping.addressName,
							street: orderBody.addresses.shipping.address,
							number: orderBody.addresses.shipping.number,
							neighborhood: orderBody.addresses.shipping.province,
							complement: orderBody.addresses.shipping.complement,
							city: orderBody.addresses.shipping.city,
							state: orderBody.addresses.shipping.state,
							zipcode: orderBody.addresses.shipping.zipcode
						},
						billing: {
							id: orderBody.addresses.billing.id,
							contactName: orderBody.addresses.billing.contactName,
							nickname: orderBody.addresses.billing.addressName,
							street: orderBody.addresses.billing.address,
							number: orderBody.addresses.billing.number,
							neighborhood: orderBody.addresses.billing.province,
							complement: orderBody.addresses.billing.complement,
							city: orderBody.addresses.billing.city,
							state: orderBody.addresses.billing.state,
							zipcode: orderBody.addresses.billing.zipcode
						}
					},
					order: {
						products: productArray,
						delivery: {
							eta: new Date(etaArray[0], etaArray[1], etaArray[2]),
							value: parseFloat(orderBody.cart.freight.amount),
							discount: parseFloat(orderBody.cart.freight.discount),
							total: parseFloat(orderBody.cart.freight.totalAmount)
						},
						payment: orderBody.payments,
						orderDiscount: parseFloat(orderBody.cart.totalDiscountAmount),
						orderTotal: parseFloat(orderBody.cart.totalAmount)
					}
				};
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
			return errorHelper.errorHandler('createOrder', 'missingParams');
		}

		return orderHelper.checkEachParam(orderObj)
			.then(() => coreAPI.makeRequest('POST', 'order', {}, orderHelper.parseOrderObj(orderObj, coreAPI) ))
			.catch((error) => {
				if(error) {
					return errorHelper.errorHandler('createOrder', error.erro.errorCode, error.erro);
				}

				return error;
			})
			.then((xmlBody) => {
				var orderData = xmlBody.response;

				if(!Array.isArray(orderData.items.itemInfo)) {
					orderData.items.itemInfo = [ orderData.items.itemInfo ];
				}

				orderData.items.itemInfo = orderData.items.itemInfo.map((sku) => {
					return {
						skuId: sku.skuId,
						subInventory: sku.subInventory
					};
				});

				return {
					id: orderData.id,
					partnerId: orderData.serviceId,
					items: orderData.items.itemInfo
				};
			});
	}

};

module.exports = Object.create(orderAPI);
