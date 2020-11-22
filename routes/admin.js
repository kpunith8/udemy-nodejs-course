const express = require('express');
const {
  getAddProduct,
  postAddProduct,
  deleteProduct,
  patchEditProduct
} = require('../controllers/admin-controller');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

// router.use() handles all the routes irrespective whether it is get or post
// be careful when using the use(), order in which routes are placed will have
// an impact on routes you are accessing
// Its better always to use specific routes
router.get('/add-product', isAuthenticated, getAddProduct);

router.post('/add-product', isAuthenticated, postAddProduct);

router.patch('/add-product', isAuthenticated, patchEditProduct);

router.delete('/add-product', isAuthenticated, deleteProduct);

module.exports = router;
