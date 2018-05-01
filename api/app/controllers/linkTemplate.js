const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const LinkTemplate = mongoose.model('LinkTemplate');

router.get('/', (req, res, next) => {
  LinkTemplate.find((err, links) => {
    if (err) return next(err);
    res.json(links);
  });
});

router.get('/:id', (req, res) => {
  const _id = req.params.id;

  LinkTemplate.findOne({ _id }, (err, link) => {
    if (err) {
      return res.json(500, { msg: err.message });
    } else if (!link) {
      res.json(404, { msg: `不存在的链接模板 ${_id} !` });
    } else {
      res.json(link);
    }
  });
});

router.post('/', (req, res) => {
  const _link = new LinkTemplate(req.body);
  _link.save((err, link) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else {
      res.json({ msg: '链接添加成功!', link });
    }
  });
});

// alias, type, domain, format
router.put('/:id', (req, res) => {
  const _id = req.params.id;
  const { alias, type, domain, format } = req.body;
  const wherestr = { _id };
  const updatestr = {};

  if (alias) {
    updatestr.alias = alias;
  }
  if (type) {
    updatestr.type = type;
  }
  if (domain) {
    updatestr.domain = domain;
  }
  if (format) {
    updatestr.format = format;
  }

  LinkTemplate.findOneAndUpdate(wherestr, updatestr, (err, link) => {
    if (err) {
      res.json(500, { msg: err.message });
    } else {
      if (link) {
        res.json({ msg: '链接修改成功!', link });
      } else {
        res.json(404, { msg: `没有找到该链接 ${_id}!` });
      }
    }
  });
});

module.exports = app => {
  app.use('/linkTemplate', router);
};

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
