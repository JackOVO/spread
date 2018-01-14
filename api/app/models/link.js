const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  color: String,
  style: String,
  size: String,
  prov: String,
  city: String,
  region: String,
  address: String,
  name: String,
  phone: String,
  yf: String,
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Link', LinkSchema);

