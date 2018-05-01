const express = require('express');
const router = express.Router();
const config = require('../../config/config');

// const mongoose = require('mongoose');
// const Article = mongoose.model('Article');

router.get('/', (req, res) => {
  res.render('index', { title: 'API 服务' });
});

router.get('/view/:type/:value', (req, res) => {
  const { type, value } = req.params;

  if (config.viewMap[type]) {
    res.render(config.viewMap[type].value, {
      title: config.viewMap[type].title,
      content: config.viewMap[type].content,
      product: config.viewMap[type].product,
      clientIP: req.ip,
      accountId: value,
      query: req.query
    });
  }
  // const typeValue = config.viewMap[type] || type;
});

module.exports = app => {
  app.use(router);
};

// router.get('/:account', (req, res, next) => {
//   res.render('link', {
//     title: '新★ 正 品 ★',
//     content: '新★ 正 品 ★',
//     account: req.params.account
//   });
// });

// router.get('/tmp/:account', (req, res, next) => {
//   res.render('link2', {
//     title: '镯子',
//     content: '镯子',
//     account: req.params.account
//   });
// });

// router.get('/', (req, res, next) => {
//   if (!req.session.account) {
//     return res.json(401, {});
//   }

//   const options = {};
//   if (req.query.sharer) {
//     options.sharer = req.query.sharer;
//   }

//   Link.find(options, (err, links) => {
//     if (err) return next(err);
//     res.json(links);
//   });
// });

// router.post('/', (req, res, next) => {
//   const _link = new Link(req.body);
//   _link.save((err, link) => {
//     if (err) {
//       res.json(500, { msg: err.message });
//     } else {
//       res.json({ msg: '保存成功!' });
//     }
//   });
// });
