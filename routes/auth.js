const express = require('express');
const {
  getLogin,
  postLogin,
  getLogout,
  getSignup,
  postSignup
} = require('../controllers/auth-controller');

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/logout', getLogout);

router.get('/signup', getSignup);

router.post('/signup', postSignup);

module.exports = router;
