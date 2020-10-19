const express = require('express');
const { getProducts } = require('../controllers/product-controller');

const router = express.Router();

router.get('/', getProducts);

module.exports = router;
