'use strict'

const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      PORT = process.env.PORT || 8080,
      app = express(),
      request = require('request'),
      fs = require('fs'),
      moment = require('moment');
    //   path.join(__dirname, 'app', 'public')

const cors = require('cors')
app.use(cors());
app.use(express.static('public'));
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

// For writing data
// getData(function(body){
//     var json = JSON.stringify(body);
//     fs.writeFile('myjsonfile.json', json, 'utf8', function(){
//         // if (err) throw err;
//         res.send(body);
//     });
// });

var dataParser = function(deets){
    var d = deets.result

      var timestamps = [];
      var byHour = {};
      var hourCount = 1;
      var start;
      for (var x = 0; x < d.length; x++){
          if (typeof start == 'undefined'){
            start = d[x.timeStamp];
            byHour[hourCount] = [];
          }
          if (d[x].timeStamp - start < 3600){
              byHour[hourCount].push(d[x].timeStamp);
          } else {
              hourCount += 1;
              byHour[hourCount] = [d[x].timeStamp];
              start = d[x].timeStamp;
          }
          
        //   var t = new Date(d[x].timeStamp * 1000);
        //   timestamps.push(t.toISOString());
      }

      return(byHour)
}

app.get('/blocks', (req, res) => {
  // todo: replace with call to db
  fs.readFile('./fixtures/blocks.json', (err, data) => {
    if (err) return console.log(err);
    res.send(JSON.parse(data));
  });
});

app.get('/block/:blockHeight', (req, res) => {
  const blockHeight = req.params.blockHeight;

  // todo: replace with call to db
  fs.readFile('./fixtures/block/' + blockHeight + '.json', (err, data) => {
    if (err) res.send({});
    res.send(JSON.parse(data));
  });

});


// send balance data
app.get('/getTime', function(req, res) {
    fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            var obj = JSON.parse(data); //now it an object
            res.send(dataParser(obj));
    }});
});

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
