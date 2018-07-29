const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientErrorSchema = new Schema({
  time: {
    type: Date,
    default: Date.now
  },
  nav: Object,
  error: Object
});

mongoose.model('ClientError', ClientErrorSchema);
