const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1', keyspace: 'zagat' });

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Cassandra DB is connected!');
  }
});


module.exports = client;
