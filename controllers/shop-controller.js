const Product = require('../models/product');

exports.getProducts = async (req, res) => {
  try {
    const result = await Product.fetchAll();

    res.render('shop/product-list', {
      products: result,
      docTitle: 'Shop',
      path: 'shop'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res) => {
  const cart = await req.user.getCart();

  res.send(JSON.stringify(cart, null, 2));
};

exports.getProductDetail = async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await Product.findById(productId);
    res.send(JSON.stringify(result, null, 2));
  } catch (err) {
    console.log(err);
  }
};

exports.addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    req.user.addToCart(product);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCartItem = async (req, res) => {
  const { productId } = req.body;
  try {
    await req.user.deleteCartItem(productId);
    console.log('Deleted the cart item!!');
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

// Below functions could be a candidate for order controller
exports.getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders();
    res.send(JSON.stringify(orders));
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res) => {
  try {
    await req.user.addOrder();
    console.log('Order added!!!');
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
};
