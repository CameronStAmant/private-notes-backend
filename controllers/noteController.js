const Note = require('../models/note');

exports.note_list = (req, res) => {
  Note.find().exec((err, list_notes) => {
    if (err) {
      return next(err);
    }
    res.json(list_notes);
  });
};

exports.note_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: Note detail: ' + req.params.id);
};

exports.note_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Note create GET');
};

exports.note_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Note create POST');
};

exports.note_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Note delete GET');
};

exports.note_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Note delete POST');
};

exports.note_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Note update GET');
};

exports.note_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Note update POST');
};
