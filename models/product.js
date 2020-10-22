const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { rootDir, getFileContent } = require('../utils');
const Cart = require('./cart');

const productFilePath = path.join(rootDir, 'data', 'products.json');

module.exports = class Product {
  // Pass id as null while creating new product for the first time
  constructor(id, title, description, price) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
  }

  save() {
    getFileContent(productFilePath, (products) => {
      products.push(this);
      // If id passed we are updating the existing product
      // patch/post action will be used but save() method is called
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(
          productFilePath,
          JSON.stringify(updatedProducts),
          (error) => {
            console.log(error);
          }
        );
      } else {
        this.id = uuidv4();
        fs.writeFile(productFilePath, JSON.stringify(products), (error) => {
          console.log(error);
        });
      }
    });
  }

  static deleteById(id) {
    getFileContent(productFilePath, (products) => {
      const product = products.find((item) => item.id === id);
      const updatedProducts = products.filter((prod) => prod.id !== id);

      fs.writeFile(
        productFilePath,
        JSON.stringify(updatedProducts),
        (error) => {
          if (!error) {
            Cart.deleteProduct(id, product.price);
          }
        }
      );
    });
  }

  static fetchAll(cb) {
    getFileContent(productFilePath, cb);
  }

  static findById(id, cb) {
    getFileContent(productFilePath, (products) => {
      const product = products.find((item) => item.id === id);

      cb(product);
    });
  }
};
