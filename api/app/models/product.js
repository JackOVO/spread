const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  describe: {
    type: String,
    default: '描述信息'
  },
  introduce: {
    type: Array,
    default: []
  },
  form: {
    type: Array,
    default: []
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Product', ProductSchema);
