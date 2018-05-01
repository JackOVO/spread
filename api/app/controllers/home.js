const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
// const Article = mongoose.model('Article');

router.get('/', (req, res) => {
  res.render('index', { title: 'API 服务' });
  // Article.find((err, articles) => {
  //   if (err) return next(err);
  //   res.render('index', {
  //     title: 'Generator-Express MVC'
  //     // articles: articles
  //   });
  // });
});

router.get('/view/', (req, res) => {
  res.render('link', {
    title: 'title',
    content: 'content',
    account: 'account'
  });
});

module.exports = app => {
  app.use(router);
};
