const { Client } = require('pg');

const connectionString = process.env.DB_URL;

const pool = new Client({
  connectionString: connectionString,
});

pool.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });

module.exports = pool;