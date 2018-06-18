const co = require('co');
const mongoose = require('mongoose');
const Account = mongoose.model('Account');
const config = require('../../config/config.js');
const util = require('../util');

const getOptions = (type, req) => {
  const view = config.viewMap[type] || {};
  const { title = '北坡', content } = view;
  const clientIP = req.get('X-Real-IP') || req.get('X-Forwarded-For') || req.ip;

  return {
    title,
    content,
    clientIP,
    query: req.query
  };
};

module.exports = {
  card: (req, res) => {
    const { accountId } = req.params;
    const options = getOptions('card', req);

    co(function*() {
      let ossPath = '';

      if (req.cookies.ossPath) {
        ossPath = req.cookies.ossPath;
      } else {
        const account = yield Account.findOne({ _id: accountId });
        ossPath = account.extend.ossPath;
        res.cookie('ossPath', ossPath, {
          maxAge: 1000 * 60 * 60 * 24 * 10
        });
      }

      options.signUrl = yield util.getSignatureUrl(ossPath);
      res.render('card', options);
    }).catch(function(err) {
      console.error(err.stack);
    });
  },
  // 从数据库中获取商品配合, 直接渲染到一个页
  product: (req, res) => {
    const { name, accountId } = req.params;
    const view = config.viewMap[name];

    if (!view) {
      return res.render('404');
    }

    const options = getOptions(name, req);
    options.accountId = accountId;
    options.product = view.product;

    res.render(view.value, options);
  }
};
