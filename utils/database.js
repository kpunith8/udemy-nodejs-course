const mongodb = require('mongodb');

const { MongoClient } = mongodb;

let db;

exports.connectToMongoDB = (cb) => {
  MongoClient.connect(
    'mongodb+srv://root:root@mongo-cluster-qclzr.mongodb.net/shopping?retryWrites=true&w=majority',
    { useUnifiedTopology: true }
  )
    .then((client) => {
      console.log('DB Connection is successful!!');
      db = client.db();
      cb();
    })
    .catch((err) => console.log(err));
};

exports.getDB = () => {
  if (db) {
    return db;
  }
  throw new Error('No Database found!!');
};
