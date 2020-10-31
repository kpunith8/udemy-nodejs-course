const mongodb = require('mongodb');
const { getDB } = require('../utils/database');

class Product {
  constructor(name, price, description, productId, userId) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.productId = productId ? new mongodb.ObjectID(productId) : null;
    this.userId = userId;
  }

  // Can be used to add new and update the existing product
  // based on whether user sets productId
  async save() {
    const db = getDB();
    let result;

    if (this.productId) {
      // update the product
      result = await db
        .collection('products')
        .updateOne(
          { _id: new mongodb.ObjectID(this.productId) },
          { $set: this }
        );
    } else {
      try {
        result = await db.collection('products').insertOne(this);
      } catch (err) {
        console.log(err);
      }
    }
    return result;
  }

  static async fetchAll() {
    const db = getDB();

    let res;
    try {
      res = await db.collection('products').find().toArray();
    } catch (err) {
      console.log(err);
    }

    return res;
  }

  static async findById(productId) {
    const db = getDB();

    let res;
    try {
      res = await db
        .collection('products')
        // When finding items by ID use mongo's ObjectID not the plain ID
        // passed.
        .find({ _id: new mongodb.ObjectID(productId) })
        .next();
    } catch (err) {
      console.log(err);
    }

    return res;
  }

  static async deleteById(productId) {
    const db = getDB();

    let res;
    try {
      res = await db
        .collection('products')
        .deleteOne({ _id: new mongodb.ObjectID(productId) });
    } catch (err) {
      console.log(err);
    }

    return res;
  }
}

module.exports = Product;
