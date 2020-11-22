const express = require('express');
const {
  getProducts,
  getCart,
  getProductDetail,
  addToCart,
  deleteCartItem,
  postOrder,
  getOrders
} = require('../controllers/shop-controller');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

router.get('/products', getProducts);

router.get('/cart', isAuthenticated, getCart);

router.post('/cart', isAuthenticated, addToCart);

router.delete('/cart', isAuthenticated, deleteCartItem);

// Create order routes and controller to separate the concerns
router.post('/order', isAuthenticated, postOrder);

router.get('/orders', isAuthenticated, getOrders);

// NOTE: Always keep the specific route above the dynamic segments
// if you have another route which starts like for eg:
// `/products/offer` below dynamic segments, dynamic
// executes first creating confusions on which route executed
router.get('/products/:id', getProductDetail);

module.exports = router;
