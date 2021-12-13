const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        User.find({ username: req.body.username }).exec((err, userFound) => {
          if (err) return next(err);
          if (userFound.length === 0) {
            const user = new User({
              username: req.body.username,
              password: hashedPassword,
            });
            user.save((err) => {
              if (err) return next(err);
              return res.sendStatus(201);
            });
          } else {
            return res.sendStatus(409);
          }
        });
      });
    }
  },
];

exports.POST_login = (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result) {
        const accessToken = jwt.sign(
          req.body.username,
          process.env.ACCESS_TOKEN_SECRET
        );
        return res.status(201).json({ accessToken });
      }
      return done(null, false, { message: 'Incorrect password' });
    });
  });
};
