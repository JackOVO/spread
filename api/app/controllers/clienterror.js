const mongoose = require('mongoose');
const ClientError = mongoose.model('ClientError');

module.exports = {
  list: (req, res, next) => {
    ClientError.find()
      .sort({ time: -1 })
      .exec((err, errorList) => {
        if (err) return next(err);
        res.json(errorList);
      });
  },
  add: (req, res) => {
    let _access = new ClientError(req.body);
    _access.save((err, access) => {
      if (err) {
        res.json(500, { msg: err.message });
      } else {
        res.json({ msg: '客户端错误记录成功!', access });
      }
    });
  }
};
