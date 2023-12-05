const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const webRoutes = require('./routes/web');
const connection = require('./models/database');
const bodyParser = require('body-parser');
const session = require('express-session');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true,
}))

app.use('/',webRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})