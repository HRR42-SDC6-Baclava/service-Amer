const faker = require('faker');

var genres = ['American', 'Asian', 'Mexican', 'Indian', 'Arabic'];
var prices = ['$', '$$', '$$$', '$$$$'];

let prevId = 10000000;
function getId(context, events, done) {
  let id = Math.floor(Math.random() * 1000000 + 9000001)
  context.vars.id = id; // set the "query" variable for the virtual user
  return done();
}


function getData(context, events, done) {
  prevId++;
  let id = prevId;
  let genre = genres[Math.floor(Math.random() * Math.floor(genres.length))];
  let name = faker.company.companyName();
  let recs = [];
  var price = prices[Math.floor(Math.random() * Math.floor(prices.length))];
  const pics = [];
  var text = faker.lorem.sentence();
  var m = Math.floor(Math.random() * (10 - 5 + 1) + 5);
  for (var l = 0; l < m; l++) {
    pics.push(Math.floor((Math.random() * 1000) + 1));
  }
  var k = Math.floor(Math.random() * 6) + 1;
  for (var j = 0; j < k; j++) {
    var rec = Math.floor((Math.random() * 10000000) + 1);
    recs.push(rec);

  }
  context.vars.id = id;
  context.vars.genre = genre;
  context.vars.name = name;
  context.vars.text = text;
  context.vars.recs = recs;
  context.vars.price = price;
  context.vars.pics = pics;
  return done();
}

module.exports = { getId, getData };