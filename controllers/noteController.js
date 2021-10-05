const Note = require('../models/note');
const { body, validationResult } = require('express-validator');

exports.note_list = (req, res) => {
  Note.find().exec((err, list_notes) => {
    if (err) {
      return next(err);
    }
    res.json(list_notes);
  });
};

exports.note_detail = (req, res) => {
  Note.findById(req.params.id).exec((err, content) => {
    if (err) {
      return next(err);
    }
    res.json({
      note: content,
    });
  });
};

exports.note_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Note create GET');
};

exports.note_create_post = [
  body('title').trim().isLength({ min: 1 }).escape(),
  body('body').trim().isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        title: req.body.title,
        body: req.body.body,
      });
    } else {
      const note = new Note({
        title: req.body.title,
        body: req.body.body,
      });

      note.save((err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          url: note.url,
        });
      });
    }
  },
];

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
