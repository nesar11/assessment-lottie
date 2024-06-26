const mongoose = require('mongoose');

const AnimationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  metadata: { type: String },
  url: { type: String, required: true }
});

module.exports = mongoose.model('Animation', AnimationSchema);
