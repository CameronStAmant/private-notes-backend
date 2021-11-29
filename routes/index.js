var express = require('express');
var router = express.Router();
const passport = require('passport');
const user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', user_controller.POST_signup);

router.post(
  '/login',
  passport.authenticate('local'),
  user_controller.POST_login
);

module.exports = router;
