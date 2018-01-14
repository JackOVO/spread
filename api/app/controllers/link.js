const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Link = mongoose.model('Link');

module.exports = (app) => {
  app.use('/link', router);
};

router.get('/:id', (req, res, next) => {
  res.render('link', {
    title: '新★ 正 品 ★',
    content: '新★ 正 品 ★'
  });
});

router.get('/', (req, res, next) => {
  Link.find((err, links) => {
    if (err) return next(err);
    res.json(links);
  });
});

router.post('/', (req, res, next) => {
  const _link = new Link(req.body);
   _link.save((err, link) => {
    if (err) {
      res.json(500, {msg: err.message});
    } else {
      res.json({msg: '保存成功!'});
    }
  });
})
