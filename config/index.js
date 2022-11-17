const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3002;
const DB_URI =
  'mongodb+srv://root:root@node-shop.qnaixik.mongodb.net/?retryWrites=true&w=majority';

module.exports = { PORT, DB_URI };
