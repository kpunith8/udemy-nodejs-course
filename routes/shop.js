const express = require('express');
const {
  getProducts,
  getCart,
  getProductDetail,
  addToCart,
  deleteCartItem,
  postOrder,
  getOrders,
} = require('../controllers/shop-controller');

const router = express.Router();

router.get('/products', getProducts);

router.get('/cart', getCart);

router.post('/cart', addToCart);

router.delete('/cart', deleteCartItem);

// Create order routes and controller to separate the concerns
router.post('/order', postOrder);

router.get('/orders', getOrders);

// NOTE: Always keep the specific route above the dynamic segments
// if you have another route which starts like for eg:
// `/products/offer` below dynamic segments, dynamic
// executes first creating confusions on which route executed
router.get('/products/:id', getProductDetail);

module.exports = router;
