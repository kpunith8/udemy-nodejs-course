const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail')

const User = require('../models/user');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    docTitle: 'Login',
    path: 'login',
    errorMessage: req.flash('loginError')
  });
};

exports.postLogin = async (req, res) => {
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
  // TODO: Verify that the password and confirmPassword match before saving to the database

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
      await sgMail.send({
        from: 'kpunith8@gmail.com',
        to: email,
        subject: 'Signup successful to Udemy NodeJS course',
        html: `<p>Your email ${email} successfully signed up to Udemy NodeJS course</p>`
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
