var fs = require('fs'),
  request = require('request'),
  json2csv = require('json2csv'),
  scrape = require('scrape-it'),
  cheerio = require('cheerio'),
  url = 'http://www.shirts4mike.com/shirts.php',
  mainPage = 'http://www.shirts4mike.com/';
  ws = fs.createWriteStream('scraper.csv');

 // const shirtURL = data.shirts[4].shirtImageURL;
 //        const priceURL = data.shirts;
 //        priceURL.forEach(function(ele, i){
          
 //        });

//Create 'data' folder if it doesn't exist
!fs.existsSync('data') ? fs.mkdirSync('data') : false;

scrape(url, 
  { 
    shirts: {
      listItem: ".products li",
      data: {
        'title': {
          selector:"img",
          attr: "alt"
        },
        'price': {
          selector: "span.price"

        },
        'shirtURL': {
          selector: "a",
          attr: "href", 
          convert: x => mainPage + x
        },
        'shirtImageURL': {
          selector: "img",
          attr: "src",
          convert: x => mainPage + x
        }
      }
    } 
}).then(data => {
    const arr = data.shirts;
    //console.log(arr);
    arr.forEach(function(ele, i){
      const fields = ['ele.title', 'ele.shirtURL', 'ele.shirtImageURL'];
      const fieldNames = ["Shirt Name", "Shirt URL", "Shirt Image URL"];
      const csv = json2csv({data: arr, fields: fields, fieldNames: fieldNames});
      console.log(csv);
     
     // fs.writeFile('shirt.csv', csv, function(err){
     //  if(err) throw err;
     //  console.log("Works");
     // });
    });  
  });
    


  










