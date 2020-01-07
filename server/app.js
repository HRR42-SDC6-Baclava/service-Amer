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
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/restaurants/:restaurantId', (req, res) => {
  var id = req.params.restaurantId;
  let getQuery = `SELECT genre, name, recs FROM zagat.recommendations WHERE id=${id};`;

  client.execute(getQuery)
    .then((data) => {
      let otherRecs;;
      let genre = data.rows[0].genre;
      let name = data.rows[0].name;
      let recs = data.rows[0].recs;
      let getRecsQuery = `SELECT pics, name, text, price from zagat.recommendations WHERE id in (${recs});`;
      client.execute(getRecsQuery)
        .then((data1) => {
          for (let i = 0; i < data1.rows.length; i++) {
            let picsArr = data1.rows[i]['pics'];
            for (let x = 0; x < picsArr.length; x++) {
              let imageNum = picsArr[x];
              picsArr[x] = `https://sdc-zagat-images.s3.amazonaws.com/Image${imageNum}.jpg`;
            }
          }
          data.rows[0].recs = data1.rows;
          res.status(200).send(data.rows[0]);
        })
    })
    .catch(err => {
      console.log(err);
      res.status(404).end();
    });
});


app.post('/api/restaurants', (req, res) => {
  let data = req.body;

  console.log([data.id, data.genre, data.name, data.pics, data.price, data.text])

  let postQuery = `Insert into zagat.recommendations(id, genre, name, pics, price ,recs, text) values (?,?,?,?,?,?,?);`;

  client.execute(postQuery, [data.id, data.genre, data.name, data.pics, data.price, data.recs, data.text], { prepare: true })
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