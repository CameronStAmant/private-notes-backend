var express = require('express');
const session = require('express-session');
const authenticateToken = require('./authenticateToken');

const cors = require('cors');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
require('./mongoConfig');
const noteRouter = require('./routes/note');
const folderRouter = require('./routes/folder');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
require('dotenv').config();

var app = express();

app.use(cors({ origin: 'http://localhost:3001' }));
// app.use(cookieParser());
app.use(
  session({
    secret: 'cats',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function (req, res, next) {
  if (req.path === '/login' || req.path === '/signup') {
    return next();
  }
  authenticateToken(req, res, next);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notebook/folders', folderRouter);
app.use('/notebook', noteRouter);

module.exports = app;
