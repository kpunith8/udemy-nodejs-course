const mongodb = require('mongodb');
const { getDB } = require('../utils/database');

class User {
  constructor(name, email, cart, userId) {
    this.name = name;
    this.email = email;
    this.cart = cart || { items: [] };
    this.userId = userId;
  }

  async save() {
    let result;
    const db = getDB();

    try {
      result = await db.collection('users').insertOne(this);
    } catch (err) {
      console.log(err);
    }

    return result;
  }

  async getCart() {
    const db = getDB();
    const productIds = this.cart.items.map((item) => item.productId);

    let result;
    try {
      const products = await db
        .collection('products')
        .find({ _id: { $in: productIds } })
        .toArray();

      // Transform the cart items with product details.
      // cart has items array with a reference to productId
      result = products.map((product) => ({
        ...product,
        quantity: this.cart.items.find(
          (item) => item.productId.toString() === product._id.toString()
        ).quantity
      }));
    } catch (err) {
      console.log(err);
    }

    return result;
  }

  async deleteCartItem(productId) {
    const db = getDB();
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    let result;

    try {
      result = await db
        .collection('users')
        .updateOne(
          { _id: new mongodb.ObjectID(this.userId) },
          { $set: { cart: { items: updatedCartItems } } }
        );
    } catch (err) {
      console.log(err);
    }

    return result;
  }

  // Add a product to the cart for the given user
  async addToCart(product) {
    const db = getDB();
    const cartProductIndex = this.cart.items.findIndex(
      (item) => item.productId.toString() === product._id.toString()
    );
    let newQuantity = 1;
    const cartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      cartItems[cartProductIndex].quantity = newQuantity;
    } else {
      cartItems.push({
        productId: new mongodb.ObjectID(product._id),
        quantity: newQuantity
      });
    }

    let result;
    try {
      result = await db.collection('users').updateOne(
        { _id: new mongodb.ObjectID(this.userId) },
        {
          $set: {
            cart: { items: cartItems }
          }
        }
      );
    } catch (err) {
      console.log(err);
    }

    return result;
  }

  static async findById(userId) {
    const db = getDB();

    let result;
    try {
      result = await db
        .collection('users')
        .findOne({ _id: new mongodb.ObjectID(userId) });
    } catch (err) {
      console.log(err);
    }

    return result;
  }

  async addOrder() {
    const db = getDB();
    let result;
    try {
      const cartWithProducts = await this.getCart();
      const order = {
        items: cartWithProducts,
        user: {
          _id: new mongodb.ObjectID(this.userId),
          // This would look redundant information on order collection
          // we can still query based on usedId, would be useful
          // tracking name and email id of the user when this order
          // was placed.
          name: this.name,
          email: this.email
        }
      };
      result = await db.collection('orders').insertOne(order);
      this.cart = [];
      await db
        .collection('users')
        .updateOne(
          { _id: new mongodb.ObjectID(this.userId) },
          { $set: { cart: { items: [] } } }
        )
        .catch((e) => console.log('Clearing items failed', e.message));
    } catch (err) {
      console.log(err);
    }

    return result;
  }

  async getOrders() {
    const db = getDB();
    let result;
    try {
      result = await db
        .collection('orders')
        .find({ 'user._id': new mongodb.ObjectID(this.userId) })
        .toArray();
    } catch (err) {
      console.log(err);
    }

    return result;
  }
}

module.exports = User;
