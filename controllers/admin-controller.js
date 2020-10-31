const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    docTitle: 'Add Product',
    path: 'add-product'
  });
};

exports.postAddProduct = async (req, res) => {
  const { user } = req;
  const { price, name, description } = req.body;
  try {
    const product = new Product(name, price, description, null, user.userId);
    await product.save(product);
    res.redirect('/products');
  } catch (err) {
    console.log(err);
  }
};

exports.patchEditProduct = async (req, res) => {
  // Pass it within a hidden input field from products page on clicking edit button
  const { price, name, description, productId } = req.body;
  const product = new Product(name, price, description, productId);

  try {
    await product.save();
    console.log('Product Updated!!!');
    res.redirect('/products');
  } catch (error) {
    console.log(error);
  }
};

exports.deleteProduct = async (req, res) => {
  // Pass it within a hidden input field from products page on clicking edit button
  const { productId } = req.body;
  try {
    await Product.deleteById(productId);
    console.log('Product Deleted!!!');
    res.redirect('/products');
  } catch (err) {
    console.log(err);
  }
};
