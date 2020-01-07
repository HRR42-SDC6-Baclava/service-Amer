var newrelic = require('newrelic');
const express = require('express');
const parser = require('body-parser');
const path = require('path');
const https = require('https');
const client = require('./db/postgres/index.js');
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

  client.query('SELECT recs, genre, name FROM recommendations where id = $1', [id])
  .then(data => {
    console.log(data.rows[0])
    return data.rows[0];
  })
  .then(async (data) => {
    let otherRecs = [];
    let recs = data['recs'];
    for (let i = 0; i < recs.length; i++) {
      otherRec = await client.query('SELECT pics, name, text, price FROM recommendations where id = $1', [recs[i]]);
      console.log(otherRec.rows[0]['pics']);
      for (let x = 0; x < otherRec.rows[0]['pics'].length; x++) {
        let imageNum = otherRec.rows[0]['pics'][x];
        otherRec.rows[0]['pics'][x] = `https://sdc-zagat-images.s3.amazonaws.com/Image${imageNum}.jpg`;
      }
      otherRecs.push(otherRec.rows[0]);

    }
    data.recs = otherRecs;
    return data;
  })
  // Client.getRestaurant(id)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
      res.status(404).end();
    });
});


app.post('/api/restaurants', (req, res) => {
  let data = req.body;

  let postQuery = `INSERT INTO recommendations values ($1,$2,$3,$4,$5,$6,$7)`;
  let recs = [];
  let postValues = [data.id, data.genre, data.name, data.pics, data.price, recs, data.text]
  var k = Math.floor(Math.random() * 6) + 1;
  for (var j = 0; j < k; j++) {
    var rec = Math.floor((Math.random() * 10200000) + 1);
    recs.push(rec);

  }
  client.query(postQuery, postValues)
    .then(() => res.status(201).send('A new record has been created!'))
    .catch(err => {
      console.log(err);
      res.status(404).end();
    });
});

app.delete('/api/restaurants/:restaurantId', (req, res) => {
  var id = req.params.restaurantId;
  let deleteQuery = `DELETE FROM recommendations WHERE id=${id};`;

  client.query(`DELETE FROM recommendations WHERE id=$1`, [id])
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