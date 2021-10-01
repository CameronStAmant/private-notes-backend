const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  title: String,
  body: String,
});

module.exports = mongoose.model('Note', NoteSchema);
