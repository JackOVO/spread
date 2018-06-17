const express = require('express');
const mongoose = require('mongoose');
const Account = mongoose.model('Account');

module.exports = {
  list: (req, res, next) => {
    Account.find((err, accounts) => {
      if (err) return next(err);
      res.json(accounts);
    });
  },
  byName: (req, res) => {
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
  },
  add: (req, res) => {
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
  },
  updateByName: (req, res) => {
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
  },
  extend: (req, res) => {
    const _id = req.params.id;

    Account.findOne({ _id }, (err, account) => {
      if (err) {
        return res.json(500, { msg: err.message });
      } else if (!account) {
        res.json(404, { msg: '不存在的用户!' });
      } else {
        res.json({ extend: account.extend || {} });
      }
    });
  },
  updateExtend: (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    const wherestr = { _id };
    const updatestr = { $set: { extend: body } };

    Account.findOneAndUpdate(
      wherestr,
      updatestr,
      { upsert: true },
      (err, account) => {
        if (err) {
          res.json(500, { msg: err.message });
        } else {
          if (account) {
            res.json({ msg: '账号扩展信息补充成功!', account });
          } else {
            res.json(404, { msg: '没有找到该账号!' });
          }
        }
      }
    );
  }
};
