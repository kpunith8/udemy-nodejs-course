const express = require('express');
const {
  getLogin,
  postLogin,
  getLogout
} = require('../controllers/auth-controller');

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/logout', getLogout);

module.exports = router;
