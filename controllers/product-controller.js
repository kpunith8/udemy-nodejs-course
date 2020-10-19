// const path = require('path');
// const { rootDir } = require('../utils');
const products = [];

exports.getAddProduct = (req, res) => {
  res.render('add-product', { docTitle: 'Add Product', path: 'add-product' });

  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
};

exports.postAddProduct = (req, res) => {
  products.push({ title: req.body.title });
  res.redirect('/');
};

exports.getShop = (req, res) => {
  // use render() function to use the template engine
  // specified
  res.render('shop', { products, docTitle: 'Shop', path: 'shop' });
  // use join method from path module to construct the path,
  // which is independent of OS it runs on,
  // since linux, mac and windows have a different
  // semantics to identify the path

  // instead of creating the path like, path.join(__dirname, '..' , 'views', 'shop.html')
  // use util method to get the rootDir where the node runs
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
};

exports.products = products;
