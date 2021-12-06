const User = require('../models/user');
const bcrypt = require('bcryptjs');

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
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err != null) {
          return next(err);
        }
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        user.save((err) => {
          if (err) return next(err);
          res.sendStatus(201);
        });
      });
    }
  },
];

exports.POST_login = (req, res, next) => {
  res.sendStatus(201);
};
