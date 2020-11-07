const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    docTitle: 'Login',
    path: 'login',
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res) => {
  User.findById('5f9d3b879bdfea06a3c9f276')
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      // This is to make sure session is stored
      // before we re-direct to the products page
      res.session.save((err) => {
        res.redirect('/products');
      });
    })
    .then()
    .catch((err) => console.log(err));
};

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/products');
  });
};
