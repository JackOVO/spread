const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkTemplateSchema = new Schema({
  alias: {
    type: String,
    default: '模板别名',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['LINK', 'PICTURE'],
    default: 'LINK'
  },
  account: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  domain: {
    type: String,
    required: true
  },
  format: {
    type: String,
    default: ':id',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('LinkTemplate', LinkTemplateSchema);
