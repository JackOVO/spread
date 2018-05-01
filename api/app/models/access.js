const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccessSchema = new Schema({
  time: {
    type: Date,
    default: Date.now
  },
  clientIP: String,
  remain: Number,
  shareLink: {
    type: String,
    required: true
  },
  account: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }
});

AccessSchema.methods = {
  fullList: function() {
    //password, cb
    // const sha = crypto.createHash('sha512');
    // sha.update(password + '一个盐');
    // var d = sha.digest('hex');
    // cb(null, d === this.password);
  }
};

mongoose.model('Access', AccessSchema);
