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

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
