const express = require('express');
const app = express();
const dotenv = require('dotenv').config({path: __dirname + '/config.env'});
const PORT = process.env.PORT || 3000;
const path = require('path');
const webRoutes = require('./routes/web');
const appRoutes = require('./routes/app');
const bodyParser = require('body-parser');
const session = require('express-session');
const server = require('http').createServer(app);
io = require('socket.io')(server);
const socketIOManager = require('./controllers/socketManager');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true,
}))

socketIOManager.socketRFID(app,io);
socketIOManager.socketIPS(app,io);
socketIOManager.sendLocation(app, io);

app.use('/',webRoutes);
app.use('/app',appRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
