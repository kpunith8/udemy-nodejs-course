const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    docTitle: 'Add Product',
    path: 'add-product',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postAddProduct = async (req, res) => {
  const { user } = req.user;
  const { price, name, description } = req.body;
  try {
    // pass user object to userId, mongoose grabs only the id and updates it.
    const product = new Product({ name, price, description, userId: user._id });
    await product.save();
    res.redirect('/products');
  } catch (err) {
    console.log(err);
  }
};

exports.patchEditProduct = async (req, res) => {
  // Pass it within a hidden input field from products page on clicking edit button
  const { price, name, description, productId } = req.body;

  Product.findById(productId)
    .then((product) => {
      product.name = name;
      product.description = description;
      product.price = price;
      return product.save();
    })
    .then((result) => {
      console.log('Product Updated!!!', result);
      res.redirect('/products');
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = async (req, res) => {
  // Pass it within a hidden input field from products page on clicking edit button
  const { productId } = req.body;
  try {
    await Product.deleteOne({ _id: productId });
    console.log('Product Deleted!!!');
    res.redirect('/products');
  } catch (err) {
    console.log(err);
  }
};
