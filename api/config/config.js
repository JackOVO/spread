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

config[env].viewMap = {
  wear: {
    value: 'old_wear',
    title: '新★ 正 品 ★',
    content: '新★ 正 品 ★',
    product: '5ae70de8c4041ce7d90e4372'
  },
  bracelet: {
    value: 'old_bracelet',
    title: '新★ 正 品 ★',
    content: '新★ 正 品 ★',
    product: '5ae8421a9e4f9d6cd056d4be'
  }
};

module.exports = config[env];
