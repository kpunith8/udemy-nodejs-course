const Product = require('../models/product');

// Example usage for Use it with mysql2
// exports.getProducts = (req, res) => {
//   Product.fetchAll()
//     .then(([rows]) => {
//       res.render('shop/product-list', {
//         products: rows,
//         docTitle: 'Shop',
//         path: 'shop',
//       });
//     })
//     .catch((err) => console.log(err));
// };

exports.getProducts = async (req, res) => {
  try {
    // const result = await Product.findAll();
    // using user model associated with object to get only the products in
    // scope not all the products.
    const result = await req.user.getProducts();

    res.render('shop/product-list', {
      products: result,
      docTitle: 'Shop',
      path: 'shop',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res) => {
  const cart = await req.user.getCart();

  const products = await cart.getProducts();

  res.send(JSON.stringify(products, null, 2));
};

exports.getProductDetail = async (req, res) => {
  const productId = req.params.id;
  try {
    // findPk(primaryKey) can also be used instead of fineOne
    const result = await Product.findOne({ where: { id: productId } });
    res.send(JSON.stringify(result, null, 2));
  } catch (err) {
    console.log(err);
  }
};

exports.addToCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await req.user.getCart();

  const [product] = await cart.getProducts({ where: { id: productId } });
  let quantity = 1;
  if (product) {
    const oldQuantity = product.cartItem.quantity;
    quantity = oldQuantity + 1;

    cart.addProduct(product, { through: { quantity } });
  } else {
    const productToBeAdded = await Product.findOne({
      where: { id: productId },
    });
    cart.addProduct(productToBeAdded, { through: { quantity } });
  }

  res.redirect('/cart');
};

exports.deleteCart = async (req, res) => {
  const { productId } = req.body;

  // Needs to wrap them within try..catch block
  const cart = await req.user.getCart();
  const [product] = await cart.getProducts({ where: { id: productId } });

  await product.cartItem.destroy();

  res.redirect('/cart');
};

// Below functions could be a candidate for order controller
exports.postOrder = async (req, res) => {
  // Each await should have their own try..catch block
  const cart = await req.user.getCart();
  const products = await cart.getProducts();
  const order = await req.user.createOrder();
  try {
    const orders = await order.addProducts(
      products.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );
    // Once cart items added to order remove them from the cart table
    await cart.setProducts(null);

    res.send(JSON.stringify(orders));
  } catch (err) {
    console.log(err);
  }
};

exports.getOrder = async (req, res) => {
  try {
    // Eager loading, loads the orders with products array in it
    const orders = await req.user.getOrders({ include: ['products'] });
    res.send(JSON.stringify(orders));
  } catch (err) {
    console.log(err);
  }
};
