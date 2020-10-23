const Sequelize = require('sequelize');

const sequelize = new Sequelize('shopping', 'root', 'admin_punith', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
/*  Using mysql2 */
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'admin_punith',
//   database: 'shopping',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// module.exports = pool.promise();
