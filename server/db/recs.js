const mongoose = require('mongoose');
const db = require('./index.js');
mongoose.Promise = global.Promise;

const recsSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  genre: String,
  title: String,
  recs: []
});

const Rec = mongoose.model('Rec', recsSchema);

module.exports = Rec;