const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Resource = mongoose.model('Resource');

router.get('/', (req, res, next) => {
  Resource.find((err, resources) => {
    if (err) return next(err);
    res.json(resources);
  });
});

router.get('/:id', (req, res) => {
  const _id = req.params.id;

  Resource.findOne({ _id }, (err, resource) => {
    if (err) {
      return res.json(500, { msg: err.message });
    } else if (!resource) {
      res.json(404, { msg: `不存在的资源 ${_id}!` });
    } else {
      res.json(resource);
    }
  });
});

router.post('/', (req, res) => {
  const _resource = new Resource(req.body);
  _resource.save((err, resource) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else {
      res.json({ msg: '资源添加成功!', resource });
    }
  });
});

router.put('/:id', (req, res) => {
  const _id = req.params.id;
  const { describe, type } = req.body;
  const wherestr = { _id };
  const updatestr = {};

  if (describe) {
    updatestr.describe = describe;
  }
  if (type) {
    updatestr.type = type;
  }

  Resource.findOneAndUpdate(wherestr, updatestr, (err, access) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else {
      if (access) {
        res.json({ msg: '资源更新成功!', updatestr });
      } else {
        res.json(404, { msg: `没有找到 ${_id} 资源!` });
      }
    }
  });
});

module.exports = app => {
  app.use('/resource', router);
};
