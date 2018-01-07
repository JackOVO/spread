const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = mongoose.model('Account');

module.exports = (app) => {
  app.use(router);
};

router.post('/signin', (req, res, next) => {
  const _account = new Account(req.body);

  Account.findOne({username: _account.username}, (err, account) => {
    if (err) {
      res.json(err.status || 500, {errorMsg: err.message});
    }

    account.comparePwd(_account.password, (err, isMatch) => {
      if(err) {
        res.json(err.message || 500, {errorMsg: err.message})
      } else if (isMatch) {
        req.session.account = account;
        res.json({username: account.username, _id: account._id});
      } else {
        res.json(500, {errorMsg: '用户名或密码错误!'})
      }
    })
  });
});
