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
  host: 'localhost',
  user: 'root',
  database: 'library',
});

// Export the pool
module.exports = pool;