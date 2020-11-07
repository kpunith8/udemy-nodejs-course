## NodeJS Shopping Cart - Udemy course by Maximilian

Built with `pug` template for minimal interaction with the UI, most of the `API` end points
have no UI except, `products`, `admin/add-product`.

## Branches having different modules

Each branch has specific code, please checkout required branch to understand the code with respect
to the technologies used.

### main - Work in progress

Will have final version of the code with `authentication`, `session management`, `error handling`
`payments`, `sending emails`, `validation` and and many more features

### mvc

Has Model View Controller with ES6 class based Models and storing and retrieving data
from the `file system.`

### dynamic-routes

Has dynamic routes examples and storing and retrieving data from the `file system`.

### with-sql-db

Used  `mysql2` and `sequelize ORM` using local DB (password mentioned in the
source will not work, you need to configure with your credentials),
directly talks to `mysql` database (installed and configured in the local system)

### with-mongo-db

Used `mongoDB` and `mongodb` node package. (configure DB with your credentials).
Directly talks to `mongoDB` database (mongo atlas cloud DB)

### with-mongoose-orm

Used `mongoDB` with `mongoose` ORM for CRUD operations on the DB.

### session-cookies

Store the session to mongoDB using `express-session` and `connect-mongodb-session` packages, and
authenticate user with a data stored in cookie
