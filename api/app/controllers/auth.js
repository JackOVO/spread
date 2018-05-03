var co = require('co');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = mongoose.model('Account');
const util = require('../util');
const config = require('../../config/config');

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
    const token = yield util.assumeRoleFull();

    res.json({
      bucket: config.oss.bucket,
      region: config.oss.region,
      accessKeyId: token.credentials.AccessKeyId,
      accessKeySecret: token.credentials.AccessKeySecret,
      stsToken: token.credentials.SecurityToken
    });
  }).catch(function(err) {
    res.json(500, err);
  });
});

module.exports = app => {
  app.use(router);
};
