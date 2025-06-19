const mongoose = require('mongoose');

require("dotenv").config();

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser : true ,
  useunifiedTopology : true
}).then(()=>console.log("mongo db connected")).catch(err =>console.error("Connection Error : ",err));


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
