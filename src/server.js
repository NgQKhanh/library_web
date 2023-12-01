const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const webRoutes = require('./routes/web');
const mysql = require('mysql2');

//config template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

//config static file
app.use(express.static(path.join(__dirname,'public')));

// route declare
app.use('/',webRoutes);

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'library'
});

// simple query
connection.query(
  'SELECT * FROM `users` WHERE userID = 1',
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})