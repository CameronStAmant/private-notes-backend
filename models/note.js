const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  title: String,
  body: String,
});

NoteSchema.virtual('url').get(function () {
  return '/notebook/' + this._id;
});

module.exports = mongoose.model('Note', NoteSchema);
