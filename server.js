const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { addToQueue } = require('./convertQueue');
const Video = require('./models/Videoup');
const Port =  process.env.PORT||5000 

const app = express();
app.use(cors({
  origin : "https://videoconverted08.netlify.app/",
  methods:["GET","POST","PUT","DELETE"],
  credentials:true
}));
app.use('/uploads', express.static('uploads'));
app.use(express.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.post('/upload', upload.array('videos', 20), async (req, res) => {
  for (let file of req.files) {
    const video = new Video({
      filename: file.originalname,
      inputPath: file.path,
      status: 'queued',
    });
    await video.save();
    addToQueue(video);
    return res.json(video);
  }
  res.status(400).json({ error: 'No files uploaded' });
});

app.get('/videos', async (req, res) => {
  const videos = await Video.find().sort({ _id: -1 });
  res.json(videos);
});

app.delete('/video/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});




app.listen(Port, () => console.log('Server started on port 5000'));


