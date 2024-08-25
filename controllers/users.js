const User = require('../models/users');

module.exports.renderSignupForm = (req, res) => {
  res.render('users/signup.ejs');
};

module.exports.handleSignup = async (req, res, next) => {
  const { username, email, password, location } = req.body;
  const newUser = new User({ username, email, location });

  try {
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', "Welcome to WanderLust!");
      res.redirect('/listings');
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'An error occurred during registration!');
    res.redirect('/signup');
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login.ejs');
};

module.exports.handleLogin = (req, res) => {
  req.flash('success', 'Welcome to WanderLust!');
  res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.handleLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', "You are logged out!");
    res.redirect('/listings');
  });
};
