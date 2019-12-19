const mongoose = require('mongoose');
const Recs = require('./recs.js');

mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
mongoose.connect('mongodb://localhost/zagat', { useNewUrlParser: true, useUnifiedTopology: true });

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Our database is connected!');
});

const getRec = (id) => {
  return Recs.find({ id })
    .exec();
};

const addRec = (record) => {
  let rec = new Recs(record);
  rec.save()
    .exec();
};

const updateRec = (id, record) => {
  Recs.findOneAndUpdate({ id }, record)
    .exec();
};

const deleteRec = (id) => {
  Recs.findOneAndDelete({ id })
    .exec();
}
module.exports = { db, getRec, addRec, updateRec, deleteRec };