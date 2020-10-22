const path = require('path');
const fs = require('fs');

const usersJson = require('../data/users.json');

// Helper method to get the rootDir where the node's main module runs
exports.rootDir = path.dirname(process.mainModule.filename);

exports.loadUsersJson = () =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise((resolve, reject) => {
    if (usersJson.users.length > 0) {
      resolve(usersJson);
    } else {
      reject(new Error('No data available'));
    }
  });

exports.getFileContent = (filePath, cb) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(data));
    }
  });
};
