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
    // var blockNumber = 5105219;
    // var hexString = blockNumber.toString(16);
    var block = api.account.txlist('0x06012c8cf97BEaD5deAe237070F9587f8E7A266d');
    block.then(function(balanceData){
        // console.log(balanceData);
        // console.log(balanceData.result)
        callback(balanceData);
      });
};


// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

// send balance data
app.get('/balance', function(req, res) {
    // res.header('Access-Control-Allow-Origin', '*')
    // res.header('Access-Control-Allow-Credentials', true)
    // res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    // res.header('Access-Control-Allow-Headers', 'Content-Type')
	getData(function(body){
		res.send(body);
	});
});

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
