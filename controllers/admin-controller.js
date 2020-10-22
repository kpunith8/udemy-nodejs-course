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
  const product = new Product(null, title, description, price);
  product.save();

  res.redirect('/products');
};

// PUT name can also be if you are updating all the fields in the
// product to new value keeping the same product id
exports.patchEditProduct = (req, res) => {
  // Pass it within a hidden input field from products page on clicking edit button
  const { productId } = req.body;
  const { price, title, description } = req.body;
  const product = new Product(productId, title, description, price);
  product.save();

  res.redirect('/products');
};

exports.deleteProduct = (req, res) => {
  // Pass it within a hidden input field from products page on clicking edit button
  const { productId } = req.body;

  Product.deleteById(productId);
  res.redirect('/products');
};
