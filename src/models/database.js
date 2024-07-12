
const mysql = require('mysql2/promise'); 

// Create a pool of database connections
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
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
