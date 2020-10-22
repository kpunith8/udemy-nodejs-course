// const path = require('path');
// const { rootDir } = require('../utils');
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    // use render() function to use the templates created with
    // template engines set
    res.render('shop/product-list', {
      products,
      docTitle: 'Shop',
      path: 'shop',
    });
  });

  // use join method from path module to construct the path,
  // which is independent of OS it runs on,
  // since linux, mac and windows have a different
  // semantics to identify the path

  // instead of creating the path like, path.join(__dirname, '..' , 'views', 'shop.html')
  // use util method to get the rootDir where the node runs
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
};

exports.getCart = (req, res) => {
  Cart.fetchAll((allItems) => {
    res.send(JSON.stringify(allItems, null, 2));
  });
};

exports.getCheckout = (req, res) => {
  res.send([]);
};

exports.getProductDetail = (req, res) => {
  const productId = req.params.id;

  Product.findById(productId, (product) => {
    res.send(JSON.stringify(product, null, 2));
  });
};

exports.addToCart = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);

    res.redirect('/cart');
  });
};
