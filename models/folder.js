const mongoose = require('mongoose');
const { Schema } = mongoose;

const FolderSchema = new Schema({
  name: { type: String, required: true },
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
});

module.exports = mongoose.model('Folder', FolderSchema);
