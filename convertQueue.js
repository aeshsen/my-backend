const ffmpeg = require('fluent-ffmpeg');
const Video = require('./models/Videoup');

const queue = [];
let active = 0;
const MAX = 2;

function processQueue() {
  while (active < MAX && queue.length > 0) {
    const video = queue.shift();
    convertVideo(video);
  }
}

async function convertVideo(videoDoc) {
  active++;

  const inputPath = videoDoc.inputPath;
  const outputPath = inputPath.replace('.mp4', '.mkv');

  await Video.findByIdAndUpdate(videoDoc._id, { status: 'processing' });

  ffmpeg(inputPath)
    .output(outputPath)
    .on('end', async () => {
      await Video.findByIdAndUpdate(videoDoc._id, {
        status: 'completed',
        outputPath,
      });
      active--;
      processQueue();
    })
    .on('error', async (err) => {
      console.error(err.message);
      await Video.findByIdAndUpdate(videoDoc._id, { status: 'failed' });
      active--;
      processQueue();
    })
    .run();
}

function addToQueue(videoDoc) {
  // Ensure only queued videos are added to the queue
  queue.push(videoDoc);
  processQueue();
}

module.exports = { addToQueue };
