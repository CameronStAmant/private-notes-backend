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

exports.note_detail = (req, res, next) => {
  Note.findById(req.params.id).exec((err, content) => {
    if (err) {
      return next(err);
    }
    res.json({
      note: content,
    });
  });
};

exports.note_create_post = [
  body('title').trim().isLength({ min: 1 }).escape(),
  body('body').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        title: req.body.title,
        body: req.body.body,
        folder: req.body.folder,
      });
    } else {
      const note = new Note({
        title: req.body.title,
        body: req.body.body,
        folder: req.body.folder,
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

exports.note_delete_post = (req, res) => {
  Note.findByIdAndDelete(req.params.id).exec((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
};

exports.note_delete_many_notes = (req, res, next) => {
  Note.deleteMany({ _id: { $in: req.body.ids } }).exec((err) => {
    if (err) return next(err);
  });
  res.sendStatus(200);
};

exports.note_update_post = [
  body('title').trim().isLength({ min: 1 }).escape(),
  body('body').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400);
    } else {
      Note.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(
        (err, content) => {
          if (err) return next(err);
          res.json({
            note: content,
          });
        }
      );
    }
  },
];
