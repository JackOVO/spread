const mongoose = require('mongoose');
const Domain = mongoose.model('Domain');

module.exports = {
  list: (req, res, next) => {
    Domain.find()
      .sort({ created: -1 })
      .exec((err, domain) => {
        if (err) return next(err);
        res.json(domain);
      });
  },
  byValue: (req, res) => {
    const value = req.params.value;

    Domain.findOne({ value }, (err, domain) => {
      if (err) {
        return res.json(500, { msg: err.message });
      } else if (!domain) {
        res.json(404, { msg: `不存在的域名 ${value}!` });
      } else {
        res.json(domain);
      }
    });
  },
  add: (req, res) => {
    const _domain = new Domain(req.body);
    _domain.save((err, domain) => {
      if (err) {
        res.json(500, { msg: err.message });
      } else {
        res.json({ msg: '域名添加成功!', domain });
      }
    });
  },
  update: (req, res) => {
    const value = req.params.value;
    const { name, status, source, accessCount } = req.body;
    const wherestr = { value };
    const updatestr = {};

    if (name) {
      updatestr.name = name;
    }
    if (status) {
      updatestr.status = status;
    }
    if (source) {
      updatestr.source = source;
    }
    if (accessCount) {
      updatestr.accessCount = accessCount;
    }

    Domain.findOneAndUpdate(wherestr, updatestr, (err, access) => {
      if (err) {
        res.json(500, { msg: err.message });
      } else {
        if (access) {
          res.json({ msg: '域名更新成功!', updatestr });
        } else {
          res.json(404, { msg: `没有找到 ${value} 域名!` });
        }
      }
    });
  }
};
