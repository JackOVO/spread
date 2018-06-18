const mongoose = require('mongoose');
const LinkTemplate = mongoose.model('LinkTemplate');

module.exports = {
  list: (req, res, next) => {
    LinkTemplate.find()
      .sort({ created: -1 })
      .exec((err, links) => {
        if (err) return next(err);
        res.json(links);
      });
  },
  byId: (req, res) => {
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
  },
  add: (req, res) => {
    const _link = new LinkTemplate(req.body);
    _link.save((err, link) => {
      if (err) {
        res.json(500, { msg: err.message });
      } else {
        res.json({ msg: '链接添加成功!', link });
      }
    });
  },
  // alias, type, domain, format
  update: (req, res) => {
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
          res.json({ msg: '链接模板修改成功!', link });
        } else {
          res.json(404, { msg: `没有找到该链接模板 ${_id}!` });
        }
      }
    });
  },
  del: (req, res) => {
    const _id = req.params.id;
    const wherestr = { _id };

    LinkTemplate.deleteOne(wherestr, (err, link) => {
      if (err) {
        res.json(500, { msg: err.message });
      } else {
        if (link) {
          res.json({ msg: '链接模板删除成功!', link });
        } else {
          res.json(404, { msg: `没有找到该链接模板 ${_id}!` });
        }
      }
    });
  }
};
