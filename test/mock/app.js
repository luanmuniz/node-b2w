'use strict';

var express = require('express'),
	app = express();

app.use('/', express.static(__dirname));
module.exports = app;