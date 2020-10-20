// const path = require('path');
// const { rootDir } = require('../utils');
const Product = require('../models/product');

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
  res.send([]);
};

exports.getCheckout = (req, res) => {
  res.send([]);
};
