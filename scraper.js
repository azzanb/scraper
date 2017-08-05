var fs = require('fs'),
  request = require('request'),
  cheerio = require('cheerio'),
  url = 'http://www.shirts4mike.com/shirts.php',
  mainPage = 'http://www.shirts4mike.com/';
  ws = fs.createWriteStream('scraper.csv');

//Create 'data' folder if it doesn't exist
!fs.existsSync('data') ? fs.mkdirSync('data') : false;

//This gives me the html. I should take this, parse it in a format that's able to be parsed to csv??
//Or am I missing a step?
request({
  url,
  json: true
}, (error, response, body) => {
  var $ = cheerio.load(body);
  
  //shirt is the object storing the JSON data
  var shirt = {
    title: "",
    price: "",
    url: "",
    urlImage: ""
  };
  
//Arrays to store data to be placed inside objects
  var titleArr = [], 
    priceArr = [],
    urlArr = [],
    urlImageArr = [];

//Grab shirt name
  var shirtTitle = $('ul.products img').each(function(){
    var title = $(this).attr().alt;
    titleArr.push(title);
    shirt.title = titleArr;
  });

//Grab URL of shirt
  var shirtUrl = $('ul.products a').each(function(){
    var url = $(this).attr().href;
    urlArr.push(url);
    shirt.url = urlArr;
  });

//Grab shirt image URL
  var shirtImage = $('ul.products img').each(function(){
    var image = $(this).attr().src;
    urlImageArr.push(image);
    shirt.urlImage = urlImageArr;
  });

//Grab prices
  const priceURL = shirt.url;

  priceURL.forEach(function(ele){
    var urls = mainPage + ele;
    request(urls, (error, response, body) => {
      var $ = cheerio.load(body);
      $('span.price').each(function(){
        var price = $(this).text();
        console.log(price);
      })
    });
  });
  
  

//   fs.writeFile('shirt.csv', JSON.stringify(shirt, null, 2), function(err){
//     //console.log("Works");
//   });
// });














