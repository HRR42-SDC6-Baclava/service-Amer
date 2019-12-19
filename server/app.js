const express = require('express');
const parser = require('body-parser');
const path = require('path');
const https = require('https');
const db = require('./db/index.js');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('client'));
app.use(parser.urlencoded({ extended: true }));

app.get('/api/restaurants/:restaurantId', (req, res) => {
  var id = req.params.restaurantId;
  db.getRec(id)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err);
      res.status(404).end();
    });
});

app.post('/api/restaurants', (req, res) => {
  let rec = req.body;
  console.log(req);
  db.addRec(rec)
    .then(() => res.status(201).send('A new record has been created!'))
    .catch(err => {
      console.log(err);
      res.status(404).end();
    });
});

app.put('/api/restaurants/:restaurantId', (req, res) => {
  let id = req.params.restaurantId;
  let rec = req.body;
  db.updateRec(id, rec)
    .then(() => res.status(200).send('The record has been updated!'))
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

app.delete('/api/restaurants/:restaurantId', (req, res) => {
  let id = req.params.restaurantId;
  db.deleteRec(id)
    .then(() => res.status(200).send('The record has been deleted!'))
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});


const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`listening on port ${port}`));