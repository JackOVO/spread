const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = mongoose.model('Account');

module.exports = (app) => {
  app.use('/account', router);
};

router.get('/', (req, res, next) => {
  Account.find((err, accounts) => {
    if (err) return next(err);

    console.info(accounts);
    res.json(accounts);
  });
});

router.post('/', (req, res, next) => {
  const _account = new Account(req.body);

  Account.find({username: _account.username}, (err, accounts) => {
    if (err) {
      return json(500, {errorMsg: err.message});
    } else if (accounts.length) {
      res.json(500, {errorMsg: '重复的用户名!'});
    } else {
      _account.save((err, account) => {
        if (err) {
          res.json(500, {errorMsg: err.message});
        } else {
          res.json({msg: '账户添加成功.'});
        }
      });
    }
  })
});


