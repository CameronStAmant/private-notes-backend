const Note = require('../models/note');
const Folder = require('../models/folder');
const { body, validationResult } = require('express-validator');

exports.GET_notes = (req, res) => {
  Note.find().exec((err, list_notes) => {
    if (err) {
      return next(err);
    }
    res.json(list_notes);
  });
};

exports.GET_note = (req, res, next) => {
  Note.findById(req.params.id).exec((err, content) => {
    if (err) {
      return next(err);
    }
    res.json({
      note: content,
    });
  });
};

exports.POST_note = [
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
        const updateFolder = async () => {
          const folder = await Folder.findById(req.body.folder);
          folder.notes.push(note._id);
          await folder.save();
          return res.json({
            url: note.url,
          });
        };
        updateFolder();
      });
    }
  },
];

exports.DELETE_note = (req, res) => {
  Note.findByIdAndDelete(req.params.id).exec((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
};

exports.DELETE_many_notes = (req, res, next) => {
  Note.deleteMany({ _id: { $in: req.body.ids } }).exec((err) => {
    if (err) return next(err);
  });
  res.sendStatus(200);
};

//update PUT_note to update the folder as well
exports.PUT_note = [
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
