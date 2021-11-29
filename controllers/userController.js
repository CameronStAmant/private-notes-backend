const User = require('../models/user');

const { body, validationResult } = require('express-validator');

exports.POST_signup = [
  body('username').trim().isLength({ min: 1 }).escape(),
  body('password').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        username: req.body.username,
        password: req.body.password,
      });
    } else {
      const user = new User({
        username: req.body.username,
        password: req.body.password,
      });
      user.save((err) => {
        if (err) return next(err);
        res.sendStatus(200);
      });
    }
  },
];

exports.POST_login = (req, res, next) => {
  res.sendStatus(201);
};
