const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { rootDir, loadUsersJson } = require('./utils');

const { PORT } = require('./config');
const { pageNotFound } = require('./controllers/error-controller');
const { connectToMongoDB } = require('./utils/database');
const User = require('./models/user');

const app = express();

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
// NOTE: Write this once the user table is seeded with an user with a specific ID
app.use(async (req, res, next) => {
  try {
    const { name, cart, email, _id } = await User.findById(
      '5f9d3b879bdfea06a3c9f276'
    );
    req.user = new User(name, email, cart, _id);
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

connectToMongoDB(() => {
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
});
