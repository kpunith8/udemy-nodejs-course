const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3002;
const DB_URI =
  'mongodb+srv://root:root@mongo-cluster-qclzr.mongodb.net/shopping?retryWrites=true&w=majority';

module.exports = { PORT, DB_URI };
