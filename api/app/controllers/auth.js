var co = require('co');
const mongoose = require('mongoose');
const Account = mongoose.model('Account');
const util = require('../util');
const config = require('../../config/config');

module.exports = {
  signin: (req, res) => {
    const _account = new Account(req.body);

    if (req.user && req.user.name === _account.name) {
      return res.json({
        _id: req.user._id,
        name: req.user.name,
        phone: req.user.phone,
        role: req.user.role,
        status: req.user.status
      });
    }

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
  },
  logout: (req, res) => {
    req.logout();
    res.json({ msg: '退出成功!' });
  },
  ossToken: (req, res) => {
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
  }
};
