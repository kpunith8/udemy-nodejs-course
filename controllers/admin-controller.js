const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    docTitle: 'Add Product',
    path: 'add-product',
  });

  // Send html file as result so that browser renders it
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
};

exports.postAddProduct = (req, res) => {
  const { price, title, description } = req.body;
  const product = new Product(title, description, price);
  product.save();

  res.redirect('/');
};
