var fs = require('fs');
var http = require('http');
var request = require('request');
var csv = require('fast-csv');
var url = 'http://www.shirts4mike.com/shirts.php';
var ws = fs.createWriteStream('scraper.csv');

//This gives me the html. I should take this, parse it in a format that's able to be parsed to csv??
//Or am I missing a step?
request(url, function(error, response, data){
  console.log(data);
});



//Create 'data' folder if it doesn't exist
!fs.existsSync('data') ? fs.mkdirSync('data') : false;


