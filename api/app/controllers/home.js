const express = require('express');
const router = express.Router();

// const mongoose = require('mongoose');
// const Article = mongoose.model('Article');

router.get('/', (req, res) => {
  res.render('index', { title: 'API 服务' });
});

// TODO: 应该不是指定域名, 从数据库中查到
router.get('/proxy/:domain/:load([/\\w]+)', (req, res) => {
  const { domain, load } = req.params;
  res.redirect(302, `http://${domain}/${load}`);
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
