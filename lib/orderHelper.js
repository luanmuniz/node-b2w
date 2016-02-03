'use strict';

var errorHandler = require('./helper').errorHandler,
	creditCard = require('credit-card'),
orderHelper = {

	emailRegex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,

	formatDate(date) {
		var year = date.getFullYear(),
			month = (date.getMonth() + 1),
			day = date.getDate();

		if(month < 10) {
			month = '0' + month;
		}

		if(day < 10) {
			day = '0' + day;
		}

		return year + '-' + month + '-' + day;
	},

	parseOrderObj(orderBody, coreAPI) {
		var finalObj = {
			orderServiceId: orderBody.partnerId,
			cart: {
				orderLines: { orderLine: [] }
			},
			customer: {
				email: orderBody.user.email,
				type: orderBody.user.type.toUpperCase(),
				documentNumber: orderBody.user.documentNumber.replace(/[\.\-\/]/gm, ''),
				name: orderBody.user.name,
				nickName: orderBody.user.nickname,
				phones: {}
			},
			addresses: {
				shipping: {
					contactName: orderBody.address.shipping.contactName,
					address: orderBody.address.shipping.street,
					number: orderBody.address.shipping.number,
					complement: orderBody.address.shipping.complement,
					province: orderBody.address.shipping.neighborhood,
					city: orderBody.address.shipping.city,
					state: orderBody.address.shipping.state,
					zipcode: orderBody.address.shipping.zipcode,
					addressName: orderBody.address.shipping.addressName
				}
			},
			payments: {}
		}, skuList, phoneList, totalPayment, skuTotalPrice, creditCardExpiration;

		if(orderBody.referer) {
			finalObj.cart.referer = orderBody.referer;
		}

		if(orderBody.cupom) {
			finalObj.cart.cupom = orderBody.cupom;
		}

		finalObj.cart.freight = {
			time: orderHelper.formatDate(orderBody.tracking.deliveryDate),
			amount: orderBody.tracking.value,
			discount: orderBody.tracking.discount,
			totalAmount: orderBody.tracking.total
		};

		if(orderBody.tracking.type && orderBody.tracking.type === 'delivery') {
			finalObj.cart.freight.scheduledDeliveryDate = finalObj.cart.freight.time;
			finalObj.cart.freight.scheduledDeliveryPeriod = orderBody.tracking.deliveryPeriod.toUpperCase();
		}

		skuList = orderBody.sku;
		if(!Array.isArray(orderBody.sku)) {
			skuList = [ orderBody.sku ];
		}

		finalObj.cart.orderLines.orderLine = skuList.map((sku) => {
			var skuObj = {};

			skuObj.sku = sku.id;

			if(sku.similar) {
				delete skuObj.id;
				skuObj.similarId = sku.similar;
			}

			skuObj.quantity = (sku.quantity)? sku.quantity : 1;
			skuObj.salePrice = sku.price;

			return skuObj;
		});

		if(orderBody.user.type.toUpperCase() === 'PF') {
			finalObj.customer.birthdate = orderHelper.formatDate(orderBody.user.birthdate);
			finalObj.customer.gender = orderBody.user.gender.toUpperCase();
		}

		if(orderBody.user.type.toUpperCase() === 'PJ') {
			finalObj.customer.corporateName = orderBody.user.corporateName;
			finalObj.customer.stateRegistration = orderBody.user.stateRegistration;
			finalObj.customer.purposePurchasing = orderBody.user.purposePurchasing;
			finalObj.customer.taxInformation = orderBody.user.taxInformation;
		}

		phoneList = orderBody.user.phones;
		if(!Array.isArray(orderBody.user.phones)) {
			phoneList = [ orderBody.user.phones ];
		}

		phoneList.forEach((phone) => {
			var phoneObj = {
				areaCode: phone.ddd,
				number: phone.number
			};

			if(phone.ramal) {
				phoneObj.ramal = phone.ramal;
			}

			if(phone.type === 'residential') {
				finalObj.customer.phones.residentialPhone = phoneObj;
			}

			if(phone.type === 'cellphone') {
				finalObj.customer.phones.cellPhone = phoneObj;
			}

			if(phone.type === 'comercial') {
				finalObj.customer.phones.commercialPhone = phoneObj;
			}
		});

		if(orderBody.user.optin) {
			finalObj.customer.optin = true;
		}

		if(orderBody.address.billing) {
			finalObj.addresses.billing = {
				contactName: orderBody.address.billing.contactName,
				address: orderBody.address.billing.street,
				number: orderBody.address.billing.number,
				complement: orderBody.address.billing.complement,
				province: orderBody.address.billing.neighborhood,
				city: orderBody.address.billing.city,
				state: orderBody.address.billing.state,
				zipcode: orderBody.address.billing.zipcode,
				addressName: orderBody.address.billing.addressName
			};
		}

		skuTotalPrice = skuList[0].price;
		if(skuList.length !== 1) {
			skuTotalPrice = skuList.reduce((previousValue, currentValue) => {
				return previousValue.price + currentValue.price;
			});
		}

		totalPayment = orderBody.tracking.total + skuTotalPrice;
		if(orderBody.payment.type.toLowerCase() === 'corporate') {
			finalObj.payments.corporateSalePayment = {
				cnpj: orderBody.payment.cnpj.replace(/[\.\-\/]/gm, ''),
				totalAmount: parseFloat((orderBody.payment.totalAmount || totalPayment)).toFixed(2)
			};
		}

		if(orderBody.payment.type.toLowerCase() === 'creditcard') {
			creditCardExpiration = orderBody.payment.cardExpirationDate.split('/');
			if(creditCardExpiration[1].length !== 2) {
				creditCardExpiration[1] = creditCardExpiration[1].substr( (creditCardExpiration[1].length - 2) );
			}

			finalObj.payments.creditCard = {
				cardBrand: orderBody.payment.cardBrand,
				cardOwnerName: orderBody.payment.cardOwnerName,
				cardNumber: orderBody.payment.cardNumber,
				cardExpirationDate: creditCardExpiration[0] + '/' + creditCardExpiration[1],
				parcels: (orderBody.payment.parcels || 1),
				totalAmount: parseFloat((orderBody.payment.total || totalPayment)).toFixed(2)
			};
		}

		return coreAPI.parseXML(finalObj);
	},

	checkEachParam(params) {
		var userError, trackingError, paymentError, addressError, skuError;

		if(!params.partnerId) {
			return errorHandler('createOrder', 'missingPartnerId');
		}

		if(!params.sku) {
			return errorHandler('createOrder', 'missingSkuInfo');
		}

		if(!params.user) {
			return errorHandler('createOrder', 'missingUserInfo');
		}

		if(!params.tracking) {
			return errorHandler('createOrder', 'missingTrackingInfo');
		}

		if(!params.payment) {
			return errorHandler('createOrder', 'missingPaymentInfo');
		}

		if(!params.address) {
			return errorHandler('createOrder', 'missingAddressInfo');
		}

		userError = orderHelper.checkUserParam(params.user);
		if(userError) {
			return userError;
		}

		skuError = orderHelper.checkSkuParam(params.sku);
		if(skuError) {
			return skuError;
		}

		trackingError = orderHelper.checkTrackingParam(params.tracking);
		if(trackingError) {
			return trackingError;
		}

		paymentError = orderHelper.checkPaymentParam(params.payment);
		if(paymentError) {
			return paymentError;
		}

		addressError = orderHelper.checkAddressParam(params.address);
		if(addressError) {
			return addressError;
		}

		return Promise.resolve(true);

	},

	checkUserParam(user) {
		var hasResidential = false,
			phoneArray;

		if(!user.email) {
			return errorHandler('createOrder', 'missingUserEmail');
		}

		if(!orderHelper.emailRegex.test(user.email)) {
			return errorHandler('createOrder', 'invalidUserEmail');
		}

		if(user.optin && user.optin !== true && user.optin !== false) {
			return errorHandler('createOrder', 'invalidUserOptin');
		}

		if(!user.type) {
			return errorHandler('createOrder', 'missingUserType');
		}

		user.type = user.type.toLowerCase();
		if(user.type !== 'pf' && user.type !== 'pj') {
			return errorHandler('createOrder', 'invalidUserType');
		}

		if(!user.nickname) {
			return errorHandler('createOrder', 'missingUserNickname');
		}

		if(user.nickname.length < 3 || user.nickname.length > 18) {
			return errorHandler('createOrder', 'invalidUserNickname');
		}

		if(user.type === 'pf') {
			if(!user.birthdate) {
				return errorHandler('createOrder', 'missingUserBirthdate');
			}

			if(!(user.birthdate instanceof Date)) {
				return errorHandler('createOrder', 'invalidUserBirthdate');
			}

			if(!user.gender) {
				return errorHandler('createOrder', 'missingUserGender');
			}

			user.gender = user.gender.toLowerCase();
			if(user.gender !== 'male' && user.gender !== 'female') {
				return errorHandler('createOrder', 'invalidUserGender');
			}
		}

		if(user.type === 'pj') {
			if(!user.corporateName) {
				return errorHandler('createOrder', 'missingUserCorporateName');
			}

			if(!user.stateRegistration) {
				return errorHandler('createOrder', 'missingUserStateRegistration');
			}

			if(!user.purposePurchasing) {
				return errorHandler('createOrder', 'missingUserPurposePurchasing');
			}

			user.purposePurchasing = user.purposePurchasing.toUpperCase().trim().replace(' ', '_');
			if(user.purposePurchasing !== 'RESALE' && user.purposePurchasing !== 'OWN_CONSUMPTION' ) {
				return errorHandler('createOrder', 'invalidUserPurposePurchasing');
			}

			if(!user.taxInformation) {
				return errorHandler('createOrder', 'missingUserTaxInformation');
			}

			user.taxInformation = user.taxInformation.toUpperCase().trim().replace(' ', '_');
			if(user.taxInformation !== 'TAXPAYER_ICMS' && user.purposePurchasing !== 'EXEMPT_TAXPAYER' && user.purposePurchasing !== 'NOT_TAXPAYER') {
				return errorHandler('createOrder', 'invalidUserTaxInformation');
			}
		}

		if(!user.documentNumber) {
			return errorHandler('createOrder', 'missingUserDocumentNumber');
		}

		if(!user.name) {
			return errorHandler('createOrder', 'missingUserName');
		}

		if(!user.phones) {
			return errorHandler('createOrder', 'missingUserPhoneObject');
		}

		phoneArray = user.phones;
		if(!Array.isArray(user.phones)) {
			phoneArray = [ user.phones ];
		}

		for (var i = phoneArray.length - 1; i >= 0; i--) {
			if(!phoneArray[i].type) {
				return errorHandler('createOrder', 'missingUserPhoneType');
			}

			phoneArray[i].type = phoneArray[i].type + '';
			if(phoneArray[i].type.toLowerCase() === 'residential' && hasResidential === false) {
				hasResidential = true;
			}

			if(phoneArray[i].type.toLowerCase() !== 'residential' && phoneArray[i].type.toLowerCase() !== 'cellphone' && phoneArray[i].type.toLowerCase() !== 'comercial') {
				return errorHandler('createOrder', 'invalidUserPhoneType');
			}

			if(!phoneArray[i].ddd) {
				return errorHandler('createOrder', 'missingUserPhoneDDD');
			}

			if(parseInt(phoneArray[i].ddd, 10) > 99 || parseInt(phoneArray[i].ddd, 10) < 10) {
				return errorHandler('createOrder', 'invalidUserPhoneDDD');
			}

			if(!phoneArray[i].number) {
				return errorHandler('createOrder', 'missingUserPhoneNumber');
			}

			if(Number.isNaN(parseInt(phoneArray[i].number, 10))) {
				return errorHandler('createOrder', 'invalidUserPhoneNumber');
			}
		}

		if(!hasResidential) {
			return errorHandler('createOrder', 'missingResidentialPhone');
		}

		return false;
	},

	checkSkuParam(sku) {
		var skuArray = sku;
		if(!Array.isArray(sku)) {
			skuArray = [ sku ];
		}

		for (var i = skuArray.length - 1; i >= 0; i--) {
			if(!skuArray[i].id && !skuArray[i].similar) {
				return errorHandler('createOrder', 'missingSkuIdOrSimilar');
			}

			if(!skuArray[i].price) {
				return errorHandler('createOrder', 'missingSkuPrice');
			}

			if(!parseFloat(skuArray[i].price)) {
				return errorHandler('createOrder', 'invalidSkuPrice');
			}

			if(skuArray[i].quantity && Number.isNaN(parseInt(skuArray[i].quantity)) ) {
				return errorHandler('createOrder', 'invalidSkuQuantity');
			}
		}

		return false;
	},

	checkTrackingParam(tracking) {
		if(!tracking.deliveryDate) {
			return errorHandler('createOrder', 'missingTrackingDeliveryDate');
		}

		if(!(tracking.deliveryDate instanceof Date) || tracking.deliveryDate <= Date.now()) {
			return errorHandler('createOrder', 'invalidTrackingDeliveryDate');
		}

		if(!tracking.value) {
			return errorHandler('createOrder', 'missingTrackingValue');
		}

		if(tracking.value && Number.isNaN(parseFloat(tracking.value))) {
			return errorHandler('createOrder', 'invalidTrackingValue');
		}

		if(!tracking.total) {
			return errorHandler('createOrder', 'missingTrackingTotal');
		}

		if(tracking.total && Number.isNaN(parseFloat(tracking.total))) {
			return errorHandler('createOrder', 'invalidTrackingTotal');
		}

		if(tracking.discount) {
			if( (tracking.value - tracking.discount) !== tracking.total) {
				return errorHandler('createOrder', 'invalidTrackingPricing');
			}
		}

		if(tracking.type && tracking.type.toLowerCase() === 'delivery') {
			if(!tracking.deliveryPeriod) {
				return errorHandler('createOrder', 'missingTrackingDeliveryPeriod');
			}

			tracking.deliveryPeriod = tracking.deliveryPeriod.toLowerCase();
			if(tracking.deliveryPeriod !== 'manha' && tracking.deliveryPeriod !== 'tarde' && tracking.deliveryPeriod !== 'noite') {
				return errorHandler('createOrder', 'invalidTrackingDeliveryPeriod');
			}
		}

		return false;
	},

	checkPaymentParam(payment) {
		var creditCardValidation, creditCardExpiration;

		if(!payment.type) {
			return errorHandler('createOrder', 'missingPaymentType');
		}

		payment.type = payment.type.toLowerCase();
		if(payment.type !== 'corporate' && payment.type !== 'creditcard') {
			return errorHandler('createOrder', 'invalidPaymentType');
		}

		if(payment.type === 'corporate') {
			if(!payment.cnpj) {
				return errorHandler('createOrder', 'missingPaymentCNPJ');
			}
		}

		if(payment.type === 'creditcard') {
			if(!payment.cardBrand) {
				return errorHandler('createOrder', 'missingPaymentCardBrand');
			}

			payment.cardBrand = payment.cardBrand.toLowerCase();
			if(payment.cardBrand !== 'mastercard' && payment.cardBrand !== 'visa' && payment.cardBrand !== 'amex' && payment.cardBrand !== 'diners') {
				return errorHandler('createOrder', 'invalidPaymentCardBrand');
			}

			if(!payment.cardOwnerName) {
				return errorHandler('createOrder', 'missingPaymentCardOwnerName');
			}

			if(!payment.cardNumber) {
				return errorHandler('createOrder', 'missingPaymentCardNumber');
			}

			if(!payment.cvv) {
				return errorHandler('createOrder', 'missingPaymentCardCvv');
			}

			if(!payment.cardExpirationDate) {
				return errorHandler('createOrder', 'missingPaymentCardCardExpirationDate');
			}

			creditCardExpiration = payment.cardExpirationDate.split('/');

			if(creditCardExpiration[1].length !== 4) {
				creditCardExpiration[1] = '20' + creditCardExpiration[1];
			}

			creditCardValidation = creditCard.validate({
				cardType: payment.cardBrand.toUpperCase(),
				number: payment.cardNumber,
				expiryMonth: creditCardExpiration[0],
				expiryYear: creditCardExpiration[1],
				cvv: payment.cvv
			});

			if(!creditCardValidation.validCardNumber) {
				return errorHandler('createOrder', 'invalidPaymentCardNumber');
			}

			if(!creditCardValidation.validExpiryMonth) {
				return errorHandler('createOrder', 'invalidPaymentExpiryMonth');
			}

			if(!creditCardValidation.validExpiryYear) {
				return errorHandler('createOrder', 'invalidPaymentExpiryYear');
			}

			if(!creditCardValidation.validCvv) {
				return errorHandler('createOrder', 'invalidPaymentCvv');
			}

			if(creditCardValidation.isExpired) {
				return errorHandler('createOrder', 'invalidPaymentExpireDate');
			}
		}

		return false;
	},

	checkAddressParam(address) {

		if(!address.shipping) {
			return errorHandler('createOrder', 'missingAddressShipping');
		}

		if(!address.shipping.contactName) {
			return errorHandler('createOrder', 'missingAddressContactName');
		}

		if(!address.shipping.street) {
			return errorHandler('createOrder', 'missingAddressStreet');
		}

		if(!address.shipping.number) {
			return errorHandler('createOrder', 'missingAddressNumber');
		}

		if(!address.shipping.neighborhood) {
			return errorHandler('createOrder', 'missingAddressNeighborhood');
		}

		if(!address.shipping.city) {
			return errorHandler('createOrder', 'missingAddressCity');
		}

		if(!address.shipping.state) {
			return errorHandler('createOrder', 'missingAddressState');
		}

		if(!address.shipping.zipcode) {
			return errorHandler('createOrder', 'missingAddressZipcode');
		}

		if(!address.shipping.addressName) {
			return errorHandler('createOrder', 'missingAddressName');
		}

		if(address.billing) {
			if(!address.billing.contactName) {
				return errorHandler('createOrder', 'missingBillingAddressContactName');
			}

			if(!address.billing.street) {
				return errorHandler('createOrder', 'missingBillingAddressStreet');
			}

			if(!address.billing.number) {
				return errorHandler('createOrder', 'missingBillingAddressNumber');
			}

			if(!address.billing.neighborhood) {
				return errorHandler('createOrder', 'missingBillingAddressNeighborhood');
			}

			if(!address.billing.city) {
				return errorHandler('createOrder', 'missingBillingAddressCity');
			}

			if(!address.billing.state) {
				return errorHandler('createOrder', 'missingBillingAddressState');
			}

			if(!address.billing.zipcode) {
				return errorHandler('createOrder', 'missingBillingAddressZipcode');
			}

			if(!address.billing.addressName) {
				return errorHandler('createOrder', 'missingBillingAddressName');
			}
		}

		return false;
	}
};

module.exports = Object.create(orderHelper);