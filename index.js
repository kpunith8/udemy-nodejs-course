const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const MongoDBSession = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { rootDir, loadUsersJson } = require('./utils');
const { PORT } = require('./config');
const { pageNotFound } = require('./controllers/error-controller');
const User = require('./models/user');

dotenv.config();
const app = express();
const csrfProtection = csrf();

const store = new MongoDBSession({
  uri: process.env.MONGO_URI,
  collection: 'loginSessions'
});

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
app.use(
  session({
    secret: 'smelly cat',
    resave: false,
    saveUninitialized: false,
    store
  })
);

// Add CSRF token after the session was created, since CSRF uses the session by default
app.use(csrfProtection);
app.use(flash());

// Use a middleware to get the user and set it to req object so
// that we can make use of the user later in other routes
// NOTE: Add this middleware once the user table is seeded with an user with a specific ID
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Instead of setting to each view, use
// res.locals object to set it and use it in each views
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

// Only the routes starting with /admin/add-product will go through this
// middleware, it is helpful to separate the routes starting point
app.use('/admin', adminRoutes);
// app.use(adminRoutes);
app.use(shopRoutes);

app.use(authRoutes);

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

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log('Connected to DB :)');

    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
