const cassandra = require('cassandra-driver');
const client = require('./index.js');

client.execute(`CREATE KEYSPACE IF NOT EXISTS zagat WITH REPLICATION = { ‘class’ : ‘SimpleStrategy’, ‘replication_factor’ : 3 };`)
  .then(() =>
    client.execute(`CREATE TYPE rec(pics list<text>,title text,price text,text text);`,
      (err) => {
        console.log(err);
      }))
  .then(() =>
    client.execute(`CREATE TABLE recommendations (id int PRIMARY KEY, recs list<rec>, genre text, title text);`,
      (err) => {
        console.log(err);
      }));