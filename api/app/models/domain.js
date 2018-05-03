const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DomainSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  accessCount: Number,
  status: {
    type: String,
    required: true,
    enum: ['DISABLE', 'GATE', 'TARGET', 'RESOURCE'],
    default: 'DISABLE'
  },
  source: String,
  created: {
    type: Date,
    default: Date.now
  },
  changed: {
    type: Date,
    default: Date.now
  }
});

DomainSchema.pre('findOneAndUpdate', function(next) {
  this._update.changed = Date.now();
  next();
});

mongoose.model('Domain', DomainSchema);
