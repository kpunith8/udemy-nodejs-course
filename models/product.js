const fs = require('fs');
const path = require('path');

const { rootDir } = require('../utils');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromAFile = (cb) => {
  fs.readFile(p, (err, data) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(data));
    }
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromAFile((products) => {
      products.push(this);

      fs.writeFile(p, JSON.stringify(products), (error) => {
        console.log(error);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromAFile(cb);
  }
};
