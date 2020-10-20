const express = require('express');
const {
  getAddProduct,
  postAddProduct,
} = require('../controllers/admin-controller');

const router = express.Router();

// router.use() handles all the routes irrespective whether it is get or post
// be careful when using the use(), order in which routes are placed will have
// an impact on routes you are accessing
// Its better always to use specific routes
router.get('/add-product', getAddProduct);

router.post('/add-product', postAddProduct);

module.exports = router;
