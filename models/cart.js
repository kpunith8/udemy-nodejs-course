const fs = require('fs');
const path = require('path');

const { rootDir, getFileContent } = require('../utils');

const cartFilePath = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(cartFilePath, (err, data) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSON.parse(data);
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct;
      if (existingProduct) {
        updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        };
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = parseFloat(cart.totalPrice) + parseFloat(productPrice);

      fs.writeFile(cartFilePath, JSON.stringify(cart), (error) => {
        if (error) {
          console.log(error);
        }
      });
    });
  }

  static fetchAll(cb) {
    getFileContent(cartFilePath, cb);
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(cartFilePath, (err, data) => {
      if (err) {
        return;
      }
      const cart = { ...JSON.parse(data) };
      const updatedCart = { ...cart };
      const product = updatedCart.products.find((prod) => prod.id === id);

      if (!product) {
        return;
      }
      const productQuantity = product.quantity;

      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice =
        parseFloat(updatedCart.totalPrice) -
        productQuantity * parseFloat(productPrice);

      fs.writeFile(cartFilePath, JSON.stringify(updatedCart), (error) => {
        if (error) {
          console.log(error);
        }
      });
    });
  }
};
