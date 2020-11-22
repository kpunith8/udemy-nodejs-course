const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const emailTransporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    docTitle: 'Login',
    path: 'login',
    errorMessage: req.flash('loginError')
  });
};

exports.postLogin = async (req, res) => {
  console.log('send grid', process.env.SENDGRID_API_KEY);
  const { userID, password } = req.body;

  try {
    const user = await User.findOne({ userID });

    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (isValidPassword) {
        console.log('Successfully logged in!!');

        req.session.user = user;
        req.session.isLoggedIn = true;
        // This is to make sure session is stored
        // before we re-direct to the products page
        await req.session.save();
        res.redirect('/products');
      } else {
        req.flash('loginError', 'Invalid User ID or Password');
        res.redirect('/login');
      }
    } else {
      req.flash('loginError', 'Invalid User ID');
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    docTitle: 'SignUp',
    path: 'signup',
    errorMessage: req.flash('signupError')
  });
};

exports.postSignup = async (req, res) => {
  const { email, userID, password, confirmPassword } = req.body;

  const user = await User.findOne({ email, userID });

  if (user) {
    req.flash('signupError', 'UserID or Email already exists!!');
    return res.redirect('/signup');
  } else {
    try {
      const encryptedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        userID,
        email,
        password: encryptedPassword,
        cart: { items: [] }
      });
      newUser.save();
      res.redirect('/login');
      await emailTransporter.sendMail({
        from: 'kpunith8@gmail.com',
        to: email,
        subject: 'Signup successful to Udemy node course',
        html: '<p>Your successfully signed up to Udemy node course</p>'
      });
    } catch (err) {
      console.log(err);
    }
  }
};

exports.getLogout = async (req, res) => {
  try {
    await req.session.destroy();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};
