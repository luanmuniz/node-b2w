'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('./mock/app'),
	agent = request(app);

describe('Checking xml mock', function() {

	it('GET /ArvoreDeCategorias', function(done) {
		agent.get('/ArvoreDeCategorias.xml')
			.expect(200)
			.end(function (err, res) {
				res.text.should.match(/xml/);
				done();
			});
	});

	it('GET /catalogofull', function(done) {
		agent.get('/catalogofull.xml')
			.expect(200)
			.end(function (err, res) {
				res.text.should.match(/xml/);
				done();
			});
	});

	it('GET /catalogoparcial', function(done) {
		agent.get('/catalogoparcial.xml')
			.expect(200)
			.end(function (err, res) {
				res.text.should.match(/xml/);
				done();
			});
	});

	it('GET /ValorDisponibilidadeEstoque', function(done) {
		agent.get('/ValorDisponibilidadeEstoque.xml')
			.expect(200)
			.end(function (err, res) {
				res.text.should.match(/xml/);
				done();
			});
	});

});