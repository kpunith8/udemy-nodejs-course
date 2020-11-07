const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res) => {
  try {
    const result = await Product.find();
    /* To populate the user fields along with the product
    because we have a userId reference in product,
    could be helpful to display user info if needed */
    // await Product.find().populate('userId')

    /* To include only name and price and exclude _id from Product and name from User */
    // await Product.find().select('name price -_id').populate('userId', 'name')
    res.render('shop/product-list', {
      products: result,
      docTitle: 'Shop',
      path: 'shop',
      isLoggedIn: req.session.isLoggedIn
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res) => {
  const cart = await req.user.populate('cart.items.productId').execPopulate();

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
    const orders = await Order.find();
    res.send(JSON.stringify(orders));
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res) => {
  const { name, _id } = req.user;
  try {
    const cartItems = await req.user
      .populate('cart.items.productId')
      .execPopulate();

    const products = cartItems.cart.items.map((cartItem) => ({
      product: { ...cartItem.productId._doc }, // To copy the whole object use, _.doc property
      quantity: cartItem.quantity
    }));

    const order = new Order({ user: { name, userId: _id }, products });
    order.save();
    console.log('Order added!!!');

    await req.user.clearCartItems();

    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
};
