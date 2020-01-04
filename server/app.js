var newrelic = require('newrelic');
const express = require('express');
const parser = require('body-parser');
const path = require('path');
const https = require('https');
const db = require('./db/index.js');
const client = require('./db/cassandra/index.js');
const morgan = require('morgan');
var newrelic = require('newrelic');


const app = express();
app.locals.newrelic = newrelic;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('client'));
app.use(parser.urlencoded({ extended: true }));

app.get('/api/restaurants/:restaurantId', (req, res) => {
  var id = req.params.restaurantId;
  let getQuery = `SELECT id, genre, name, recs FROM zagat.recommendations WHERE id=${id};`;

  client.execute(getQuery)
    .then(data => {
      return data.rows[0];
    })
    .then(async (data) => {
      let otherRecs = [];
      let recs = data['recs'];
      for (let i = 0; i < recs.length; i++) {
        let getRecsQuery = `SELECT pics, name, text, price from zagat.recommendations WHERE id=${recs[i]};`;
        otherRec = await client.execute(getRecsQuery);
        console.log(otherRec.rows[0]['pics']);
        for (let x=0; x<otherRec.rows[0]['pics'].length; x++){
          let imageNum= otherRec.rows[0]['pics'][x];
          otherRec.rows[0]['pics'][x]= `https://sdc-zagat-images.s3.amazonaws.com/Image${imageNum}.jpg`;
        }
        otherRecs.push(otherRec.rows[0]);

      }
      data.recs = otherRecs;
      return data;
    })
    .then(data => {
      console.log(data)
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
      res.status(404).end();
    });
});

app.post('/api/restaurants', (req, res) => {
  let data = req.body;

  console.log("HERE------>" + data)
  console.log([data.id, data.genre, data.name, data.pics, data.price, data.text])

  let postQuery = `Insert into zagat.recommendations(id, genre, name, pics, price ,recs, text) values (?,?,?,?,?,?,?);`;
  let getRecsQuery = `SELECT id, genre from zagat.recommendations Limit 1000`;
  let recs = [];
  client.execute(getRecsQuery)
    .then(results => {
      results = results.rows;
      console.log(results)
      var k = Math.floor(Math.random() * 6) + 1;
      for (var j = 0; j < results.length; j++) {
        if (results[j].genre === data.genre) {
          recs.push(results[j].id)
        }
        if (recs.length === k) break;
      }
      return recs;
    })
    .then((recs) => client.execute(postQuery, [data.id, data.genre, data.name, data.pics, data.price, recs, data.text], { prepare: true }))
    .then(() => res.status(201).send('A new record has been created!'))
    .catch(err => {
      console.log(err);
      res.status(404).end();
    });
});

app.delete('/api/restaurants/:restaurantId', (req, res) => {
  var id = req.params.restaurantId;
  let deleteQuery = `DELETE FROM zagat.recommendations WHERE id=${id};`;

  client.execute(deleteQuery)
    .then(() => {
      res.send('The record has been deleted!');
    })
    .catch(err => {
      console.log(err);
      res.status(404).end();
    });
});

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`listening on port ${port}`));