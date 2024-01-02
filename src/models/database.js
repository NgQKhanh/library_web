// const mysql = require('mysql2');

// // create the connection to database
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'library'
//   });

// connection.connect((err) => {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }
//    console.log('Connected to database.');
// });

// module.exports = connection;

const mysql = require('mysql2/promise'); // Assuming you are using the promise-based version

// Create a pool of database connections
const pool = mysql.createPool({
  // host: 'localhost',
  // user: 'root',
  // password: '130401',
  // database: 'library',
  host: 'library-ahtkhanh-0b08.a.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_ccZgH2sTOD1RrwlIa0D',
  database: 'defaultdb',
  port: 26264, 
  ssl: {
    rejectUnauthorized: false, 
  },
});

// Export the pool
module.exports = pool;