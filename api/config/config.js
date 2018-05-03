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

config[env].oss = {
  bucket: 'jk-wx',
  region: 'oss-cn-beijing',
  ak: {
    accessKeyId: 'LTAIhUmdS0sYXq7M',
    accessKeySecret: 'wkk1gxD8pfGfr9NydSLGIE4wfWxc2s'
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
  },
  card: {
    value: 'card',
    title: '微信名片',
    content: '微信名片'
  }
};

module.exports = config[env];
