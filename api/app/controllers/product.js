const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = mongoose.model('Product');

router.get('/', (req, res, next) => {
  Product.find((err, products) => {
    if (err) return next(err);
    res.json(products);
  });
});

router.get('/:name', (req, res) => {
  const name = req.params.name;

  Product.findOne({ name }, (err, product) => {
    if (err) {
      return res.json(500, { msg: err.message });
    } else if (!product) {
      res.json(404, { msg: `不存在的产品 ${name}!` });
    } else {
      res.json(product);
    }
  });
});

router.post('/', (req, res) => {
  const _product = new Product(req.body);

  Product.find({ name: _product.name }, (err, product) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else if (product.length) {
      res.json(500, { msg: `${_product.name} 产品名已存在!` });
    } else {
      _product.save((err, product) => {
        if (err) {
          res.json(500, { msg: err.message });
        } else {
          res.json({ msg: '产品添加成功.', product });
        }
      });
    }
  });
});

router.put('/:name', (req, res) => {
  const name = req.params.name;
  const wherestr = { name };
  const updatestr = Object.assign({}, req.body);

  if (updatestr.name) {
    delete updatestr.name;
  }

  Product.findOneAndUpdate(wherestr, updatestr, (err, product) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else {
      if (product) {
        res.json({ msg: '产品修改成功!', product });
      } else {
        res.json(404, { msg: `不存在的产品 ${name}!` });
      }
    }
  });
});

module.exports = app => {
  app.use('/product', router);
};
