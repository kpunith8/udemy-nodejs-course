const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
// const expressHbs = require('express-handlebars');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { rootDir, loadUsersJson } = require('./utils');

const { PORT } = require('./config');
const { pageNotFound } = require('./controllers/error-controller');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// Register handlebars as a engine since it is not part of
// express as that of pug
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout'}));

// use handlebars as a default view engine
// app.set('view engine', 'hbs');

// To set default view engine as pug
app.set('view engine', 'pug');
app.set('views', 'views');

// Serve the static files using express.static middleware
// If you refer the css file in html files, it needs to have
// access to public folder access.
app.use(express.static(path.join(rootDir, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use a middleware to get the user and set it to req object so
// that we can make use of the user
// NOTE: Write this once the user table is seeded with an user with an id of 1
app.use(async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: 1 } });
    // sets the req with an user with sequelize user with
    // which we can perform, save, destroy and other actions on it.
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

// Only the routes starting with /admin/add-product will go through this
// middleware, it is helpful to separate the routes starting point
app.use('/admin', adminRoutes);
// app.use(adminRoutes);
app.use(shopRoutes);

app.get('/users', async (req, res) => {
  try {
    const users = await loadUsersJson();
    res.send(users);
  } catch (error) {
    res.send(error.message);
  }
});

// Add 404 Error page at the end to handle unhandled routes
// Should be added at the end once all the routes are defined
app.use(pageNotFound);

// Setup relationship before creating the tables
Product.belongsTo(User, { onDelete: 'CASCADE' });
// Not required
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
// Creates the tables
// Executing async/await code in IIFE
(async () => {
  try {
    // pass { force: true } to sync to re-create the tables if any relationship or table
    // structure updated
    await sequelize.sync();
    // Create a dummy user
    const dummyUser = await User.findOne({ where: { id: 1 } });

    if (!dummyUser) {
      // Need to wrap each await calls with in try..catch blocks
      // to handle the errors if any
      try {
        const createdUser = await User.create({
          name: 'Punith K',
          email: 'kpunith8@abc.com',
        });
        if (createdUser) {
          try {
            await createdUser.createCart();
          } catch (e) {
            console.log(e);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
