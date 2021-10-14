const mongoose = require('mongoose');

const mongoDB = process.env.DEVELOPMENT_MONGODB_URI;

mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
