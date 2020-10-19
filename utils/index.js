const path = require('path');
const usersJson = require('../data/users.json');

// Helper method to get the rootDir where the node's main module runs
const rootDir = path.dirname(process.mainModule.filename);

const loadUsersJson = () =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise((resolve, reject) => {
    if (usersJson.users.length > 0) {
      resolve(usersJson);
    } else {
      reject(new Error('No data available'));
    }
  });

module.exports = { rootDir, loadUsersJson };
