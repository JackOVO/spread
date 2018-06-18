const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    secret: 'learnRestApiwithNickjs',
    root: rootPath,
    app: {
      name: 'spread'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/spread-development',
    viewMap: {
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
      wristband: {
        value: 'old_wristband',
        title: '+科技改变生活',
        content: '智能手环-官方活动-正式启动 698元智能手环',
        product: '5afffe9d1afb4b20a8d2e75c'
      },
      newWristband: {
        value: 'wristband',
        title: '+ 科技改变生活',
        content: '智能手环-官方活动-正式启动 698元智能手环',
        product: '5afffe9d1afb4b20a8d2e75c'
      },
      card: {
        value: 'card',
        title: '微信名片',
        content: '微信名片'
      }
    }
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
    db: 'mongodb://localhost/spread-developmentV2',
    viewMap: {
      wear: {
        value: 'old_wear',
        title: '新★ 正 品 ★',
        content: '新★ 正 品 ★',
        product: '5aeb0cda9803f33c670a8dac'
      },
      bracelet: {
        value: 'old_bracelet',
        title: '新★ 正 品 ★',
        content: '新★ 正 品 ★',
        product: '5aeb0cbd9803f33c670a8dab'
      },
      wristband: {
        value: 'old_wristband',
        title: '+科技改变生活',
        content: '智能手环-官方活动-正式启动 698元智能手环',
        product: '5b0001152e733b7f57c2ea28'
      },
      newWristband: {
        value: 'wristband',
        title: '+ 科技改变生活',
        content: '智能手环-官方活动-正式启动 698元智能手环',
        product: '5b0001152e733b7f57c2ea28'
      },
      card: {
        value: 'card',
        title: '微信名片',
        content: '微信名片'
      }
    }
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

module.exports = config[env];
