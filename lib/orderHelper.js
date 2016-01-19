'use strict';

var errorHelper = require('./helper'),
orderHelper = {

	parseOrderObj(orderBody) {
		return orderBody;
	},

	checkEachParam(params) {
		var userError, trackingError, paymentError, addressError;

		if(!params.partnerId) {
			return errorHelper.errorHandler('order', 'missingPartnerId');
		}

		if(!params.user) {
			return errorHelper.errorHandler('order', 'missingUserInfo');
		}

		if(!params.tracking) {
			return errorHelper.errorHandler('order', 'missingTrackingInfo');
		}

		if(!params.payment) {
			return errorHelper.errorHandler('order', 'missingPaymentInfo');
		}

		if(!params.address) {
			return errorHelper.errorHandler('order', 'missingAddressInfo');
		}

		userError = orderHelper.checkUserParam(params.user);
		if(userError) {
			return userError;
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
		if(!user) {
			return true;
		}

		return false;
	},

	checkTrackingParam(tracking) {
		if(!tracking) {
			return true;
		}

		return false;
	},

	checkPaymentParam(payment) {
		if(!payment) {
			return true;
		}

		return false;
	},

	checkAddressParam(address) {
		if(!address) {
			return true;
		}

		return false;
	}
};

module.exports = Object.create(orderHelper);