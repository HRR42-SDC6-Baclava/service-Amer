const cassandra = require('cassandra-driver');
const client = require('./index.js');

client.execute(`CREATE KEYSPACE IF NOT EXISTS zagat WITH REPLICATION = { ‘class’ : ‘SimpleStrategy’, ‘replication_factor’ : 1 };`)
  .then(() =>
    client.execute(`CREATE TABLE IF NOT EXISTS zagat.recommendations (id int PRIMARY KEY, genre text, name text, recs list <int>, price text, pics list <int>, text text);`,
      (err) => {
        console.log(err);
      }))
  .then(() =>
    client.execute(`COPY zagat.recommendations (id,genre,name,pics,price,recs,text) FROM '/Users/roubaishou/Desktop/Coding/HR/HRR42/SDC/service-Amer/server/db/cassandra/csv/test.csv' WITH DELIMITER='|' AND HEADER=TRUE;`,
      (err) => {
        console.log(err);
      }));

