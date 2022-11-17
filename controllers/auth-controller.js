const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    docTitle: 'Login',
    path: 'login',
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res) => {
  User.findById('6375f811d283e3e80865fcee')
    .then((user) => {
      console.log({user})
      req.session.user = user;
      req.session.isLoggedIn = true;
      // This is to make sure session is stored
      // before we re-direct to the products page
      req.session.save((err) => {
        res.redirect('/products');
      });
    })
    .catch((err) => console.log(err));
};

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/products');
  });
};
