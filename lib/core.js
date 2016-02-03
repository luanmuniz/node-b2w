'use strict';

var xml2js = require('xml2js'),
	parser = xml2js.Parser({
		explicitArray: false,
		valueProcessors: [ function(value) {
			if(value.toLowerCase() === 'false' || value.toLowerCase() === 'true') {
				return (value.toLowerCase() === 'true');
			}

			return value.trim();
		} ]
	}),
	got = require('got'),
	errorHelper = require('./helper'),
	querystring = require('querystring'),
coreAPI = {

	rootUrl: 'https://carrinho.b2b{{company}}.com.br/commerce-api/api/',
	errorHandler: errorHelper.errorHandler,
	helper: errorHelper,
	env: false,
	keys: false,

	init(keys, env) {
		if(!keys || !keys.symbol || !keys.company || !keys.login || !keys.password) {
			return errorHelper.errorHandler('core', 'missingCredentials', null, true);
		}

		keys.company = keys.company.toLowerCase();
		if(keys.company !== 'americanas' && keys.company !== 'submarino' && keys.company !== 'shoptime') {
			return errorHelper.errorHandler('core', 'companyNotFound', null, true);
		}

		if(env && env === 'development') {
			coreAPI.rootUrl = coreAPI.rootUrl.replace('https://carrinho', 'http://homologacao');
		}

		coreAPI.rootUrl = coreAPI.rootUrl.replace('{{company}}', keys.company.toLowerCase());
		coreAPI.env = (env || 'production');
		coreAPI.keys = keys;

		return coreAPI;
	},

	parseResponse(response) {
		var parserPromise = new Promise((resolve, reject) => {
			parser.parseString(response.body, function(err, body) {
				if(err) {
					return reject(err);
				}

				return resolve(body);
			});
		});

		return parserPromise;
	},

	parseXML(json) {
		var builder = new xml2js.Builder({
			rootName: 'order',
			headless: true,
			renderOpts: { pretty: false }
		});

		return builder.buildObject(json);
	},

	makeRequest(method, route, params, body) {
		var finalUrl = coreAPI.rootUrl + route,
			paramsString = '',
			authString = coreAPI.keys.login + ':' + coreAPI.keys.password,
			gotParams = {
				method: method,
				body: body,
				timeout: false,
				headers: {
					Authorization: 'Basic ' + new Buffer(authString, 'utf8').toString('base64')
				}
			};

		if(!params) {
			params = {};
		}

		params.storeSymbol = coreAPI.keys.symbol;
		paramsString = querystring.stringify(params);
		finalUrl = finalUrl + '?' + paramsString;

		return got(finalUrl, gotParams)
			.then(coreAPI.parseResponse)
			.catch((error) => {
				if(error.statusCode === 401) {
					return errorHelper.errorHandler('core', 'requestError');
				}

				console.log(error.response.body);
				return coreAPI.parseResponse(error.response).then((body) => {
					delete body.error.$;
					error.error = body.error;
					return errorHelper.errorHandler('core', 'requestError', error);
				});
			});
	}

};

module.exports = Object.create(coreAPI);
