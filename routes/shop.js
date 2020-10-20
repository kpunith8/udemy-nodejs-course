const express = require('express');
const { getProducts, getCart, getCheckout } = require('../controllers/shop-controller');

const router = express.Router();

router.get('/', getProducts);

router.get('/cart', getCart);

router.checkout('/checkout', getCheckout);

module.exports = router;
