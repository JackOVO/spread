const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Resource = mongoose.model('Resource');

router.get('/', (req, res, next) => {
  const { offset, size, account } = req.query;
  const offset1 = (offset && offset - 0) || 0;
  const size1 = (size && size - 0) || 101;
  const query = account ? { account } : {};

  Resource.count({}, (err, total) => {
    Resource.find(query)
      .skip(offset1)
      .limit(size1)
      .sort({ changed: -1 })
      .exec((err, resources) => {
        if (err) return next(err);
        res.json({ resources, total });
      });
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

router.delete('/:id', (req, res) => {
  const _id = req.params.id;
  const wherestr = { _id };

  Resource.deleteOne(wherestr, (err, link) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else {
      if (link) {
        res.json({ msg: '资源删除成功!', link });
      } else {
        res.json(404, { msg: `没有找到该资源 ${_id}!` });
      }
    }
  });
});

module.exports = app => {
  app.use('/resource', router);
};
