const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  describe: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['LINK', 'PICTURE'],
    default: 'PICTURE'
  },
  mime: {
    type: String,
    required: true
  },
  meta: Object,
  size: {
    type: Number,
    required: true
  },
  ossPath: {
    type: String,
    required: true
  },
  changed: {
    type: Date,
    default: Date.now
  },
  account: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  }
});

mongoose.model('Resource', ResourceSchema);
