const fs = require('fs'),
  json2csv = require('json2csv'), //parses JSON to CSV
  scrape = require('scrape-it'), //Scrapes shirt info 
  date = new Date(),
  url = 'http://www.shirts4mike.com/shirts.php',
  mainPage = 'http://www.shirts4mike.com/', 
  priceData = [];

//These variables are for setting the current time for each shirt object
const hour = date.getUTCHours(),
      min = date.getUTCMinutes(),
      sec = date.getUTCSeconds();
   
//Create 'data' folder if it doesn't exist
!fs.existsSync('data') ? fs.mkdirSync('data') : false;

//Save file based on date created
const year = date.getFullYear(),
      month = date.getMonth(),
      day = date.getDate();
let saveDateFile = `${year}-${month}-${day}`;
let file = `./data/${saveDateFile}.csv`;

//Scrape title, URLs of shirt and shirt image
scrape(url, 
  { 
    shirts: {
      listItem: ".products li",
      data: {
        title: {
          selector:"img",
          attr: "alt"
        },
        shirtURL: {
          selector: "a",
          attr: "href", 
          convert: x => mainPage + x
        },
        shirtImageURL: {
          selector: "img",
          attr: "src",
          convert: x => mainPage + x
        },
        
      }
    } 
  //Next, scrape prices from each shirt url. 
}).then(data => {
    const arrOfShirts = data.shirts;
    
    /* get shirt urls, put urls in array, then scrape price of each shirt
      by looping through the array */
    arrOfShirts.forEach(function(ele, i){
      const urls = ele.shirtURL; 
      priceData.push(urls); 
      scrape(priceData[i],
        {
          shirts: {
            listItem: "h1",
            data: {
              price: {
                selector: ".price",
              }
            } 
          }
      }).then(shirts => {
        arrOfShirts[i].price = shirts.shirts[1].price;
        arrOfShirts[i].time = `${hour}:${min}:${sec}`; //this sets the UTC time at which each shirt was scraped

        //Set column headers and row information of csv file
        const fields = ['title', 'price', 'shirtURL', 'shirtImageURL', 'time'],
              fieldNames = ["Shirt Name", "Price", "Shirt URL", "Shirt Image URL", "Time"],
              csv = json2csv({data: arrOfShirts, fields: fields, fieldNames: fieldNames});
    
         fs.writeFile(file, csv, function(err){
          if(err) throw err;
         });
      }); 
    }); 
  }).catch((e) => {
    //catch any 404 errors and log message, as well as create an error log file
    let toDate = date.toDateString(),
        time = date.toTimeString(),
        fullDate = `${toDate} ${time}`;
        
    if(e.code === "ENOTFOUND"){
      if(!fs.existsSync('scraper-error.log')){
        const options = `Could not complete network connection: ${fullDate} | ${e.code}`;
        fs.writeFile('./data/scraper-error.log', options, () => {
          console.log("Error File Created. Check scraper-error.log file for details.");
         });
      }
    }
  });