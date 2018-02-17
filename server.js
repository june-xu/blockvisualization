'use strict'

const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      PORT = process.env.PORT || 8080,
      app = express(),
      request = require('request');

app.use(express.static(path.join(__dirname, 'app', 'public')));
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

var API_KEY = 'YEEWRXRQ8R2TN2ATBFTXWIF7UH81K4UR7D'
var api = require('etherscan-api').init(API_KEY);

var getData = function(callback) {
	var block = api.proxy.eth_getBlockByNumber(9);
    block.then(function(balanceData){
        callback(balanceData);
      });
};


// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world')
});

// send balance data
app.get('/balance', function(req, res) {
	getData(function(body){
		res.send(body);
	});
});

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})