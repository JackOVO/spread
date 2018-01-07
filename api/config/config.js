const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'spread'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/spread-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'spread'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/spread-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'spread'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/spread-production'
  }
};

module.exports = config[env];
