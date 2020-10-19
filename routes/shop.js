const express = require('express');
const { getShop } = require('../controllers/product-controller');

const router = express.Router();

router.get('/', getShop);

module.exports = router;
