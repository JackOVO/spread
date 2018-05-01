const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Account = mongoose.model('Account');

router.get('/', (req, res, next) => {
  // if (!req.session.account || req.session.account.role !== 'ADMIN') {
  //   return res.json(401, {});
  // }

  Account.find((err, accounts) => {
    if (err) return next(err);
    res.json(accounts);
  });
});

router.get('/:name', (req, res) => {
  const name = req.params.name;

  Account.findOne({ name }, (err, account) => {
    if (err) {
      return res.json(500, { msg: err.message });
    } else if (!account) {
      res.json(404, { msg: '不存在的用户!' });
    } else {
      res.json(account);
    }
  });
});

router.post('/', (req, res) => {
  const _account = new Account(req.body);

  Account.find({ name: _account.name }, (err, accounts) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else if (accounts.length) {
      res.json(500, { msg: `${_account.name} 用户名已存在!` });
    } else {
      _account.save((err, account) => {
        if (err) {
          res.json(500, { msg: err.message });
        } else {
          res.json({ msg: '账户添加成功.', account });
        }
      });
    }
  });
});

// status, alias, phone, passowrd
router.put('/:name', (req, res) => {
  const name = req.params.name;
  const { alias, status, password, phone } = req.body;
  const wherestr = { name };
  const updatestr = {};

  if (status) {
    updatestr.status = status;
  }
  if (alias) {
    updatestr.alias = alias;
  }
  if (phone) {
    updatestr.phone = phone;
  }
  if (password) {
    updatestr.password = password;
  }

  Account.findOneAndUpdate(wherestr, updatestr, (err, account) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else {
      if (account) {
        res.json({ msg: '账号修改成功!', account });
      } else {
        res.json(404, { msg: '没有找到该账号!' });
      }
    }
  });
});

module.exports = app => {
  app.use('/account', router);
};
