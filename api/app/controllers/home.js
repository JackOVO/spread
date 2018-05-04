var co = require('co');
const OSS = require('ali-oss');
const express = require('express');
const router = express.Router();
const util = require('../util');
const config = require('../../config/config');

const mongoose = require('mongoose');
const Domain = mongoose.model('Domain');
const Account = mongoose.model('Account');

router.get('/', (req, res) => {
  res.render('index', { title: 'API 服务' });
});

// TODO: 应该不是指定域名, 从数据库中查到
router.get('/proxy/:load([/\\w]+)', (req, res) => {
  const { load } = req.params;

  Domain.findOne({ status: 'TARGET' }, (err, domain) => {
    if (err) {
      return res.json(500, { msg: err.message });
    } else if (!domain) {
      res.redirect(302, `http://${load}`);
    } else {
      res.redirect(302, `http://${domain.value}/${load}`);
    }
  });
});

// TODO: 类型判断, 给商品ID?
router.get('/view/:type/:value([/\\w]+)', (req, res) => {
  const { type, value } = req.params;
  const view = config.viewMap[type];

  if (view) {
    const options = {
      title: view.title,
      content: view.content,
      clientIP: req.ip,
      query: req.query
    };

    switch (type) {
    case 'card':
      co(function*() {
        const token = yield util.assumeRoleRead();
        const account = yield Account.findOne({ _id: value });
        // TODO: OSS 创建移动至 util 中
        const client = new OSS({
          bucket: config.oss.bucket,
          region: config.oss.region,
          accessKeyId: token.credentials.AccessKeyId,
          accessKeySecret: token.credentials.AccessKeySecret,
          stsToken: token.credentials.SecurityToken
        });
        options.signUrl = client.signatureUrl(account.extend.ossPath);
        res.render(view.value, options);
      });
      break;
    default:
      options.accountId = value;
      options.product = view.product;
      res.render(view.value, options);
      break;
    }
  } else {
    res.json(404, {});
  }

  // console.info('000000');
  // if (config.viewMap[type]) {
  //   if (config.viewMap[type].value === 'tmp_wximg') {
  //     co(function*() {
  //       const token = yield sts.assumeRole(
  //         'acs:ram::1286126737392301:role/jkwxobjectfullaccess',
  //         policy,
  //         15 * 60,
  //         'session-azhi'
  //       );
  //
  //       var signUrl = client.signatureUrl(value);
  //       res.render(config.viewMap[type].value, {
  //         signUrl
  //       });
  //     }).catch(function(err) {
  //       res.json(500, err);
  //     });
  //     return;
  //   }
  //   res.render(config.viewMap[type].value, {
  //     product: config.viewMap[type].product,
  //     clientIP: req.ip,
  //     accountId: value,
  //     query: req.query
  //   });
  // }
});

module.exports = app => {
  app.use(router);
};
