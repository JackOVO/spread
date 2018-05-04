const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  alias: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN', 'COMMON'],
    default: 'COMMON'
  },
  status: {
    type: String,
    required: true,
    enum: ['ACTIVE', 'DISABLED'],
    default: 'ACTIVE'
  },
  extend: {
    type: Object,
    default: {}
  },
  created: {
    type: Date,
    default: Date.now
  }
});

AccountSchema.pre('save', function(next) {
  const sha = crypto.createHash('sha512');
  sha.update(this.password + '一个盐');
  this.password = sha.digest('hex');
  next();
});

AccountSchema.pre('findOneAndUpdate', function(next) {
  if (this._update.password) {
    const sha = crypto.createHash('sha512');
    sha.update(this._update.password + '一个盐');
    this._update.password = sha.digest('hex');
  }
  next();
});

AccountSchema.methods = {
  comparePwd: function(password, cb) {
    const sha = crypto.createHash('sha512');
    sha.update(password + '一个盐');
    var d = sha.digest('hex');
    cb(null, d === this.password);
  }
};

mongoose.model('Account', AccountSchema);
