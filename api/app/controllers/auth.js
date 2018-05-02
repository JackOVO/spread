const OSS = require('ali-oss');
var co = require('co');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = mongoose.model('Account');

const config = require('../../config/config');

var STS = OSS.STS;
const sts = new STS({
  accessKeyId: 'LTAIhUmdS0sYXq7M',
  accessKeySecret: 'wkk1gxD8pfGfr9NydSLGIE4wfWxc2s'
});
const policy = {
  Version: '1',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'oss:GetObject',
        'oss:PutObject',
        'oss:DeleteObject',
        'oss:GetObjectAcl',
        'oss:PutObjectAcl',
        'oss:ListParts',
        'oss:AbortMultipartUpload',
        'oss:ListObjects',
        'oss:RestoreObject'
      ],
      Resource: ['acs:oss:*:*:jk-wx', 'acs:oss:*:*:jk-wx/*'],
      Condition: {}
    }
  ]
};

router.post('/signin', (req, res) => {
  const _account = new Account(req.body);

  Account.findOne({ name: _account.name }, (err, account) => {
    if (err) {
      res.json(err.status || 500, { errorMsg: err.message });
    }

    if (!account) {
      return res.json(500, { errorMsg: '用户名或密码错误!' });
    }

    account.comparePwd(_account.password, (err, isMatch) => {
      if (err) {
        res.json(err.message || 500, { errorMsg: err.message });
      } else if (isMatch) {
        // 保存用户信息
        req.session.account = account;

        res.json({
          _id: account._id,
          name: account.name,
          phone: account.phone,
          role: account.role,
          status: account.status
        });
      } else {
        res.json(500, { errorMsg: '用户名或密码错误!' });
      }
    });
  });
});

router.get('/logout', (req, res) => {
  req.session.account = null;
  res.json({ msg: '退出成功!' });
});

// TODO: 访问控制
router.get('/token', (req, res) => {
  co(function*() {
    const token = yield sts.assumeRole(
      'acs:ram::1286126737392301:role/jkwxobjectfullaccess',
      policy,
      15 * 60,
      'session-azhi'
    );

    res.json({
      bucket: 'jk-wx',
      region: 'oss-cn-beijing',
      accessKeyId: token.credentials.AccessKeyId,
      accessKeySecret: token.credentials.AccessKeySecret,
      stsToken: token.credentials.SecurityToken
    });
  }).catch(function(err) {
    res.json(500, err);
  });
});

// TODO: 类型判断, 给商品ID?
router.get('/view/:type/:value([/\\w]+)', (req, res) => {
  const { type, value } = req.params;

  console.info('000000');

  if (config.viewMap[type]) {
    if (config.viewMap[type].value === 'tmp_wximg') {
      co(function*() {
        const token = yield sts.assumeRole(
          'acs:ram::1286126737392301:role/jkwxobjectfullaccess',
          policy,
          15 * 60,
          'session-azhi'
        );

        const client = new OSS({
          bucket: 'jk-wx',
          region: 'oss-cn-beijing',
          accessKeyId: token.credentials.AccessKeyId,
          accessKeySecret: token.credentials.AccessKeySecret,
          stsToken: token.credentials.SecurityToken
        });
        var signUrl = client.signatureUrl(value);
        res.render(config.viewMap[type].value, {
          signUrl
        });
      }).catch(function(err) {
        res.json(500, err);
      });
      return;
    }

    res.render(config.viewMap[type].value, {
      title: config.viewMap[type].title,
      content: config.viewMap[type].content,
      product: config.viewMap[type].product,
      clientIP: req.ip,
      accountId: value,
      query: req.query
    });
  }
});

module.exports = app => {
  app.use(router);
};
