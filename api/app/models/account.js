const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  rele: {
    type: String,
    required: true,
    enum: ['ADMIN', 'COMMON'],
    default: 'ADMIN'
  },
  status: {
    type: String,
    required: true,
    enum: ['ACTIVE', 'DISABLED'],
    default: 'ACTIVE'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

AccountSchema.pre('save', function(next)  {
  const sha = crypto.createHash('sha512');
  sha.update(this.password + '一个盐');
  this.password = sha.digest('hex');
  console.info('this.password', this.password);
  next();
});

AccountSchema.methods = {
  comparePwd: function (password, cb) {
    const sha = crypto.createHash('sha512');
    sha.update(password + '一个盐');
    var d = sha.digest('hex');
    cb(null, d === this.password);
  }
};

mongoose.model('Account', AccountSchema);

