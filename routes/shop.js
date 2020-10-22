const express = require('express');
const {
  getProducts,
  getCart,
  getCheckout,
  getProductDetail,
  addToCart,
} = require('../controllers/shop-controller');

const router = express.Router();

router.get('/products', getProducts);

router.get('/cart', getCart);

router.post('/cart', addToCart);

router.get('/checkout', getCheckout);

// NOTE: Always keep the specific route above the dynamic segments
// if you have another route which starts like for eg:
// `/products/offer` below dynamic segments, dynamic
// executes first creating confusions on which route executed
router.get('/products/:id', getProductDetail);

module.exports = router;
