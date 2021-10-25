const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
});

NoteSchema.virtual('url').get(function () {
  return '/notebook/' + this._id;
});

module.exports = mongoose.model('Note', NoteSchema);
