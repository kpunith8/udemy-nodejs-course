const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  userID: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: String,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product'
        },
        quantity: Number
      }
    ]
  }
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity
    });
  }

  this.cart = { items: cartItems };

  return this.save();
};

userSchema.methods.deleteCartItem = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  this.cart = { items: updatedCartItems };

  this.save();
};

// To clear the cart items once they are added to the orders
userSchema.methods.clearCartItems = function () {
  this.cart = { items: [] };

  this.save();
};

module.exports = mongoose.model('User', userSchema);
