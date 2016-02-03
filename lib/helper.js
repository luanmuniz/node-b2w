'use strict';

var errorAPI = {

	errorObj: {
		core: {
			requestError: 'Request Error',
			missingCredentials: 'You need to pass your credentials to initialize the module',
			companyNotFound: 'This company does not exist',
			'9000': 'Não foi possível estabelecer uma conexão com o MIDI B2W.'
		},

		products: {
			missingId: 'You need to pass a valid id',
			missingIds: 'You need to pass a valid array of id',
			productNotFound: 'Product not found',
			categoryNotFound: 'Category not found',
			skuNotFound: 'Sku not found',
			invalidDate: 'You need to pass a valid date'
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
			missingSku: 'You need to pass a valid Sku',
			'9000': 'Não foi possível estabelecer uma conexão com o MIDI B2W.'
		},

		createOrder: {
			missingId: 'You need to pass a valid id',
			missingPartnerId: 'Order not found',
			missingSkuInfo: '',
			missingUserInfo: '',
			missingTrackingInfo: '',
			missingPaymentInfo: '',
			missingAddressInfo: '',
			missingUserEmail: '',
			missingUserType: '',
			missingUserNickname: '',
			missingUserBirthdate: '',
			missingUserGender: '',
			missingUserCorporateName: '',
			missingUserStateRegistration: '',
			missingUserPurposePurchasing: '',
			missingUserTaxInformation: '',
			missingUserDocumentNumber: '',
			missingUserName: '',
			missingUserPhoneObject: '',
			missingUserPhoneType: '',
			missingUserPhoneDDD: '',
			missingUserPhoneNumber: '',
			missingSkuId: '',
			missingSkuPrice: '',
			missingTrackingDeliveryDate: '',
			missingTrackingDeliveryPeriod: '',
			missingTrackingValue: '',
			missingTrackingTotal: '',
			missingPaymentType: '',
			missingPaymentCardBrand: '',
			missingPaymentCardOwnerName: '',
			missingPaymentCardExpirationDate: '',
			missingAddressShipping: '',
			missingAddressContactName: '',
			missingAddressStreet: '',
			missingAddressNumber: '',
			missingAddressComplement: '',
			missingAddressNeighborhood: '',
			missingAddressCity: '',
			missingAddressState: '',
			missingAddressZipcode: '',
			missingAddressName: '',
			missingBillingAddressContactName: '',
			missingBillingAddressStreet: '',
			missingBillingAddressNumber: '',
			missingBillingAddressComplement: '',
			missingBillingAddressNeighborhood: '',
			missingBillingAddressCity: '',
			missingBillingAddressState: '',
			missingBillingAddressZipcode: '',
			missingBillingAddressName: '',
			invalidUserEmail: '',
			invalidUserOptin: '',
			invalidUserType: '',
			invalidUserNickname: '',
			invalidUserBirthdate: '',
			invalidUserGender: '',
			invalidUserPurposePurchasing: '',
			invalidUserTaxInformation: '',
			invalidUserPhoneType: '',
			invalidUserPhoneDDD: '',
			invalidSkuPrice: '',
			invalidTrackingDeliveryDate: '',
			invalidTrackingDeliveryPeriod: '',
			invalidTrackingPricing: '',
			invalidPaymentType: '',
			invalidPaymentCardBrand: '',
			invalidPaymentCardNumber: '',
			invalidPaymentExpiryMonth: '',
			invalidPaymentExpiryYear: '',
			invalidPaymentCvv: '',
			invalidPaymentExpireDate: '',

			'8001': 'O pedido 123 do parceiro HomoZimpAcom já existe na B2W, o número do pedido na B2W é 02-620825200, gravado no dia 2016-01-21 17:45:41.099.',
			'7040': 'O  campo <totalAmount> de <corporateSalePayment> é obrigatório e deve ser um valor monetário.',
			'9000': 'Não foi possível estabelecer uma conexão com o MIDI B2W.'
		},

		order: {

		}

	},

	errorHandler: function(section, code, err, throwError) {
		var returnedError = { success: false },
			message = 'Unknown Error';

		returnedError.code = code;

		if(err) {
			returnedError.erro = err;
		}

		if(err && err.error) {
			// jshint camelcase: false
			// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
			message = '[API ERROR] ' + err.error.error_message;
			returnedError.erro = {
				// jshint camelcase:false
				// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
				errorCode: err.error.error_code,
				// jshint camelcase:false
				// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
				errorMessage: err.error.error_message,
				statusCode: err.statusCode
			};
		}

		if(errorAPI.errorObj.hasOwnProperty(section)) {
			if(errorAPI.errorObj[section].hasOwnProperty(code)) {
				message = errorAPI.errorObj[section][code];
			}
		}

		returnedError.message = message;

		if(throwError) {
			throw new Error(returnedError.message);
		}

		return Promise.reject(returnedError);
	}

};

module.exports = Object.create(errorAPI);
