const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');
const Account = mongoose.model('Account');

module.exports = (app) => {
  app.use('/account', router);
};

router.get('/', (req, res, next) => {
  Account.find((err, accounts) => {
    if (err) return next(err);
    res.json(accounts);
  });
});
router.get('/:username', (req, res, next) => {
  const username = req.params.username;

  Account.findOne({username}, (err, account) => {
    if (err) {
      return json(500, {msg: err.message});
    } else if (!account) {
      res.json(404, {msg: '不存在的用户!'});
    } else {
      console.info(account);
      res.json(account);
    }
  })
});

router.post('/', (req, res, next) => {
  const _account = new Account(req.body);

  Account.find({username: _account.username}, (err, accounts) => {
    if (err) {
      return json(500, {msg: err.message});
    } else if (accounts.length) {
      res.json(500, {msg: '重复的用户名!'});
    } else {
      _account.save((err, account) => {
        if (err) {
          res.json(500, {msg: err.message});
        } else {
          res.json({msg: '账户添加成功.'});
        }
      });
    }
  });
});

router.put('/:username', (req, res, next) => {
  const username = req.params.username;
  const {status, password} = req.body;
  const wherestr = {username};
  const updatestr = {};

  if (status) { updatestr.status = status; }
  if (password) {
    const sha = crypto.createHash('sha512');
    sha.update(password + '一个盐');
    updatestr.password = sha.digest('hex');
  }

  Account.findOneAndUpdate(wherestr, updatestr, (err, account) => {
    if (err) {
      res.json(500, {msg: err.message});
    } else {
      if (account) {
        res.json({msg: '账号状态修改成功!'});
      } else {
        res.json(404, {msg: '没有找到该账号!'})
      }
    }
  });
});


