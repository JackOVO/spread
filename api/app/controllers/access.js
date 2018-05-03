const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Access = mongoose.model('Access');

// TODO: API 分页, 时间排序
router.get('/', (req, res, next) => {
  Access.find((err, access) => {
    if (err) return next(err);
    res.json(access);
  });
});

router.get('/full', (req, res, next) => {
  const { offset, size, account } = req.query;
  const offset1 = (offset && offset - 0) || 0;
  const size1 = (size && size - 0) || 101;
  const query = account ? { account } : {};

  Access.count(query, (err, total) => {
    Access.find(query)
      .skip(offset1)
      .limit(size1)
      .sort({ time: -1 })
      .populate([
        {
          path: 'account',
          select: '-__v -_id -password -created -status -role'
        },
        { path: 'product', select: '-__v -form -introduce' },
        { path: 'order', select: '_id' }
      ])
      .exec((err, access) => {
        if (err) return next(err);
        res.json({ access, total });
      });
  });
});

router.get('/:id', (req, res) => {
  const _id = req.params.id;

  Access.findOne({ _id }, (err, access) => {
    if (err) {
      return res.json(500, { msg: err.message });
    } else if (!access) {
      res.json(404, { msg: `不存在的访问 ${_id} !` });
    } else {
      res.json(access);
    }
  });
});

router.get('/:id/full', (req, res) => {
  const _id = req.params.id;

  Access.findOne({ _id })
    .populate([
      { path: 'account', select: '-__v -_id -password -created -status -role' },
      { path: 'product', select: '-__v -form -introduce' }
    ])
    .exec((err, access) => {
      if (err) {
        return res.json(500, { msg: err.message });
      } else if (!access) {
        res.json(404, { msg: `不存在的访问 ${_id} !` });
      } else {
        res.json(access);
      }
    });
});

router.post('/', (req, res) => {
  const _access = new Access(req.body);
  _access.save((err, access) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else {
      res.json({ msg: '访问记录成功!', access });
    }
  });
});

// order
router.put('/:id', (req, res) => {
  const _id = req.params.id;
  const { order } = req.body;
  const wherestr = { _id };
  const updatestr = {};

  if (order) {
    updatestr.order = order;

    Access.findOneAndUpdate(wherestr, updatestr, (err, access) => {
      if (err) {
        res.json(500, { msg: err.message });
      } else {
        if (access) {
          res.json({ msg: '访问补充成功!', order });
        } else {
          res.json(404, { msg: `没有找到 ${_id} 访问!` });
        }
      }
    });
  } else {
    res.json(400, { msg: '缺少 order 参数!' });
  }
});

module.exports = app => {
  app.use('/access', router);
};
