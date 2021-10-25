const Folder = require('../models/folder');
const { body, validationResult } = require('express-validator');

exports.GET_folders = (req, res, next) => {
  Folder.find().exec((err, list) => {
    if (err) return next(err);
    res.json(list);
  });
};

exports.GET_folder = (req, res, next) => {
  Folder.findById(req.params.id).exec((err, folder) => {
    if (err) return next(err);
    res.json({ folder: folder });
  });
};

exports.POST_folder = [
  body('name').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        name: req.body.name,
      });
    } else {
      const folder = new Folder({
        name: req.body.name,
      });

      folder.save((err) => {
        if (err) return next(err);
        res.sendStatus(200);
      });
    }
  },
];

exports.DELETE_folder = (req, res, next) => {
  Folder.findByIdAndDelete(req.params.id).exec((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
};

exports.PUT_folder = [
  body('name').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        name: req.body.name,
      });
    } else {
      Folder.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(
        (err, content) => {
          if (err) return next(err);
          res.json({
            folder: content,
          });
        }
      );
    }
  },
];
