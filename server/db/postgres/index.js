const pg = require('pg');
let config = {
  user: 'roubaishou',
  database: 'zagat',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

let pool = new pg.Pool(config);

pool.connect();


module.exports = pool;
