const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  filename: String,
  inputPath: String,
  outputPath: String,
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued',
  },
});

module.exports = mongoose.model('Video', videoSchema);
