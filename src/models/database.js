
require ('dotenv').config();
const mysql = require('mysql2/promise'); 

// Create a pool of database connections
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '130401',
  database: 'library',
  // host: 'library-ahtkhanh-0b08.a.aivencloud.com',
  // user: 'avnadmin',
  // password: 'AVNS_ccZgH2sTOD1RrwlIa0D',
  // database: 'defaultdb',
  // port: 26264, 
  // ssl: {
  //   rejectUnauthorized: false, 
  // },
});

// Export the pool
module.exports = pool;