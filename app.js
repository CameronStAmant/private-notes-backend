var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const noteRouter = require('./routes/note');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoDB = process.env.DEVELOPMENT_MONGODB_URI;

mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notebook', noteRouter);

module.exports = app;
