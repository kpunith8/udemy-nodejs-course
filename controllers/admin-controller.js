const { v4: uuidv4 } = require('uuid');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    docTitle: 'Add Product',
    path: 'add-product',
  });
};

exports.postAddProduct = async (req, res) => {
  const { price, name, description } = req.body;
  try {
    // When an association made in sequelize for user model/table
    // sequelize adds mixins/methods to insert the product
    // without specifying the id of the user since sequelize knows
    // relationship hasMany with the Product model/table
    await req.user.createProduct({
      id: uuidv4(),
      price,
      name,
      description,
    });

    /* Pass userId from req.user.id to associate the user to product
      Same as using the createProduct on user model */
    // await Product.create({
    //   id: uuidv4(),
    //   price,
    //   name,
    //   description,
    //   userId: req.user.id,
    // });
    res.redirect('/products');
  } catch (err) {
    console.log(err);
  }
};

// PUT name can also be if you are updating all the fields in the
// product to new value keeping the same product id
exports.patchEditProduct = async (req, res) => {
  // Pass it within a hidden input field from products page on clicking edit button
  const { productId } = req.body;
  const { price, name, description } = req.body;
  try {
    const updatedProduct = await Product.update(
      { name, price, description },
      { where: { id: productId } }
    );
    console.log(updatedProduct);
    res.redirect('/products');
  } catch (error) {
    console.log(error);
  }

  /* Use product.save() to update by overwriting the each value or updated ones */
  // try {
  //   const product = await Product.findOne({ where: { id: productId } });
  //   product.name = name;
  //   product.price = price;
  //   product.description = description;

  //   // wrap try catch to handle errors
  //   const updatedProduct = await product.save();
  //   console.log(updatedProduct);
  //   res.redirect('/products');
  // } catch (err) {
  //   console.log('err');
  // }
};

exports.deleteProduct = async (req, res) => {
  // Pass it within a hidden input field from products page on clicking edit button
  const { productId } = req.body;
  try {
    await Product.destroy({ where: { id: productId } });

    res.redirect('/products');
  } catch (err) {
    console.log(err);
  }
};
