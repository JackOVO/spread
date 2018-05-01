const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerAddress: {
    type: Array,
    required: true
  },
  expressNumber: String,
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  model: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  changed: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['待发货', '发货', '签收', '退回'],
    default: '待发货'
  },
  account: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  accessLink: {
    type: String,
    required: true
  }
});

mongoose.model('Order', OrderSchema);
