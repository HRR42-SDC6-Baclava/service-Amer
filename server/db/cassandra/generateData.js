const faker = require('faker');
const fs = require('fs');
const path = require('path');
const images = require('./Images.js')


const generateAllRecodes = (fileName, start) => {
  let ok = true;
  let firstTime = new Date();
  const writeToFile = fs.createWriteStream(path.join(__dirname, `/csv/${fileName}.csv`));
  writeToFile.write('id|genre|name|pics|price|recs|text\n');
  let recordsSize = 10000000;
  var genres = ['American', 'Asian', 'Mexican', 'Indian'];
  var prices = ['$', '$$', '$$$', '$$$$'];
  let i = start;
  const seed = () => {
    do {
      const id = i + 1;
      const genre = genres[Math.floor(Math.random() * Math.floor(genres.length))];
      var name = faker.company.companyName();
      let recs = [];
      var price = prices[Math.floor(Math.random() * Math.floor(prices.length))];
      const pics = [];
      var text = faker.lorem.sentence();
      var m = Math.floor(Math.random() * (10 - 5 + 1) + 5);
      for (var l = 0; l < m; l++) {
        var picUrl = images[Math.floor((Math.random() * 1000) + 1)];
        pics.push(picUrl);
      }
      var k = Math.floor(Math.random() * 6) + 1;
      for (var j = 0; j < k; j++) {
        var rec = Math.floor((Math.random() * 10000000) + 1);
        recs.push(rec);

      }
      const data = `${id}|${genre}|${name}|${pics}|${price}|${recs}|${text}\n`;
      i++;
      recordsSize--;

      if (recordsSize === 0) {
        writeToFile.write(data);
        console.log("This " + fileName + "file took: " + (new Date() - firstTime) / 1000 + " to generate all data!");
      } else {
        ok = writeToFile.write(data);
      }
    } while (recordsSize > 0 && ok);

    if (recordsSize > 0) {
      writeToFile.once('drain', seed);
    }
  }
  seed();
};



generateAllRecodes('recommendations', 0);



