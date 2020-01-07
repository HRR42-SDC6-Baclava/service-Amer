const cassandra = require('cassandra-driver');
const contactpoint = '127.0.0.1' || '172.31.27.109:9042';

const client = new cassandra.Client({ contactPoints: [contactpoint], localDataCenter: 'datacenter1', keyspace: 'zagat', pooling: { maxRequestsPerConnection: 32768
} });

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Cassandra DB is connected!');
  }
});

module.exports = client;
