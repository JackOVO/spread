const mongoose = require('mongoose');
const Organization = mongoose.model('Organization');

module.exports = {
  list: (req, res, next) => {
    Organization.find((err, organizations) => {
      if (err) return next(err);
      res.json(organizations);
    });
  },
  byName: (req, res) => {
    const name = req.params.name;

    Organization.findOne({ name }, (err, organization) => {
      if (err) {
        return res.json(500, { msg: err.message });
      } else if (!organization) {
        res.json(404, { msg: `不存在的组织 ${name}!` });
      } else {
        res.json(organization);
      }
    });
  },
  add: (req, res) => {
    const _organization = new Organization(req.body);

    Organization.find({ name: _organization.name }, (err, organization) => {
      if (err) {
        res.json(500, { msg: err.message });
      } else if (organization.length) {
        res.json(500, { msg: `${_organization.name} 组织已存在!` });
      } else {
        _organization.save((err, organization) => {
          if (err) {
            res.json(500, { msg: err.message });
          } else {
            res.json({ msg: '组织添加成功.', organization });
          }
        });
      }
    });
  },
  update: (req, res) => {
    const name = req.params.name;
    const wherestr = { name };
    const updatestr = Object.assign({}, req.body);

    if (updatestr.name) {
      delete updatestr.name;
    }

    Organization.findOneAndUpdate(wherestr, updatestr, (err, organization) => {
      if (err) {
        res.json(500, { msg: err.message });
      } else {
        if (organization) {
          res.json({ msg: '组织修改成功!', organization });
        } else {
          res.json(404, { msg: `不存在的组织 ${name}!` });
        }
      }
    });
  }
};
