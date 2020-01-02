const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1', keyspace: 'zagat' });

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Cassandra DB is connected!');
  }
});


client.execute(`CREATE TABLE zagat.recommendations (id int PRIMARY KEY,genre text,name text,recs text,price test,pics text,text text);`,
  (err) => {
    console.log(err);
  })


module.exports = client;

// COPY recommendations (id,genre,name,pics,price,recs,text) FROM '/Users/roubaishou/Desktop/Coding/HR/HRR42/SDC/service-Amer/server/db/cassandra/csv/recommendations.csv' WITH DELIMITER='|' AND HEADER=TRUE;


