const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = mongoose.model('Order');

// TODO: 时间排序
router.get('/', (req, res, next) => {
  Order.find((err, orders) => {
    if (err) return next(err);
    res.json(orders);
  });
});

router.get('/:id', (req, res) => {
  const _id = req.params.id;

  Order.findOne({ _id }, (err, order) => {
    if (err) {
      return res.json(500, { msg: err.message });
    } else if (!order) {
      res.json(404, { msg: `不存在的订单 ${_id}!` });
    } else {
      res.json(order);
    }
  });
});

router.post('/', (req, res) => {
  const _order = new Order(req.body);
  _order.save((err, order) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else {
      res.json({ msg: '订单添加成功!', order });
    }
  });
});

// order
router.put('/:id', (req, res) => {
  const _id = req.params.id;
  const { status } = req.body;
  const wherestr = { _id };
  const updatestr = {};

  if (status) {
    updatestr.status = status;

    Order.findOneAndUpdate(wherestr, updatestr, (err, access) => {
      if (err) {
        res.json(500, { msg: err.message });
      } else {
        if (access) {
          res.json({ msg: '订单状态更新成功!', status });
        } else {
          res.json(404, { msg: `没有找到 ${_id} 订单!` });
        }
      }
    });
  } else {
    res.json(400, { msg: '缺少 status 参数!' });
  }
});

module.exports = app => {
  app.use('/order', router);
};
