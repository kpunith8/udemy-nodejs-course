const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE(16, 2),
    defaultValue: 0.0,
  },
  description: DataTypes.TEXT,
});

module.exports = Product;

// To work with sequelize create sequelize models instead of class based models

// To use it with mysql2
// const db = require('../utils/database');
// module.exports = class Product {
//   // Pass id as null while creating new product for the first time
//   constructor(id, name, description, price) {
//     this.id = id;
//     this.name = name;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute('INSERT INTO products values(?, ?, ?, ?)', [
//       uuidv4(),
//       this.name,
//       this.price,
//       this.description,
//     ]);
//   }
// }
