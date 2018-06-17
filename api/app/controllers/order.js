const mongoose = require('mongoose');
const Order = mongoose.model('Order');

module.exports = {
  // TODO: 时间排序
  list: (req, res, next) => {
    const { offset, size, account } = req.query;
    const offset1 = (offset && offset - 0) || 0;
    const size1 = (size && size - 0) || 101;
    const query = account ? { account } : {};

    Order.count(query, (err, total) => {
      Order.find(query)
        .skip(offset1)
        .limit(size1)
        .sort({ changed: -1 })
        .exec((err, orders) => {
          if (err) return next(err);
          res.json({ orders, total });
        });
    });
  },
  fullList: (req, res, next) => {
    const { offset, size, account, start, end } = req.query;
    const query = account ? { account } : {};

    if (start) {
      query.changed = { $gte: new Date(start) };
    }

    if (end) {
      query.changed = Object.assign(query.changed || {}, {
        $lte: new Date(`${end} 23:59:59`)
      });
    }

    let Query = Order.find(query);

    if (offset && size) {
      Query = Query.skip(offset - 0).limit(size - 0);
    }
    Query = Query.sort({ changed: -1 }).populate([
      {
        path: 'account',
        select: '-__v -password -created -status -role'
      },
      { path: 'product', select: '-__v -form -introduce' }
    ]);

    Order.count(query, (err, total) => {
      Query.exec((err, orders) => {
        if (err) return next(err);
        res.json({ orders, total });
      });
    });
  },
  byId: (req, res) => {
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
  },
  add: (req, res) => {
    const _order = new Order(req.body);
    _order.save((err, order) => {
      if (err) {
        res.json(500, { msg: err.message });
      } else {
        res.json({ msg: '订单添加成功!', order });
      }
    });
  },
  update: (req, res) => {
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
  }
};
