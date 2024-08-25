const express = require("express");
const router = express.Router();
const User = require('../models/users');
const passport = require('passport');
const { savedRedirectUrl } = require('../middleware');
const  userContrllers  = require('../controllers/users.js');

router.get('/signup', (userContrllers.renderSignupForm));

router.post('/signup', (userContrllers.handleSignup));

router.get('/login', (userContrllers.renderLoginForm));

router.post('/login',
  savedRedirectUrl,
  passport.authenticate('local', { failureRedirect: '/login' }), 
  (userContrllers.handleLogin)
  );

router.get('/logout',(userContrllers.handleLogout) );

module.exports = router;
