const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  describe: String,
  scope: {
    type: Array,
    default: []
  },
  created: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }
});

mongoose.model('Organization', OrganizationSchema);
