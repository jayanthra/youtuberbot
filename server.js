const express = require('express')
const cors = require('cors')
const reddit = require("reddits-api")
require('dotenv').config()
const {
  spawn
} = require('child_process');

const {
  upload
} = require('youtube-videos-uploader');


const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const port = 3000
app.get('/', (req, res) => {
  res.send('Hello World!')
})

function uploadVideo(title, description, res) {
  console.log("Uploading video to Youtube...")
  const credentials = {
    email: process.env.EMAIL,
    pass: process.env.PASSWORD,
    recoveryemail: process.env.RECOVERY
  }
  const onVideoUploadSuccess = (videoUrl) => {
    console.log("Upload success")
    res.send({
      status: 200,
      message: "Success",
      videoUrl
    });
  }
  const video = {
    path: './assets/video.mp4',
    title,
    description,
    onSuccess: onVideoUploadSuccess
  }
  upload(credentials, [video]).then(console.log)
}

app.get('/getstory', (req, res) => {
  reddit.subPosts("pettyrevenge").then((subPosts) => {
    res.send(subPosts)
  }).catch((err) => {
    throw err
  })
})

app.post('/create', (req, res) => {
  console.log('Got body:', req.body);
  const {
    title,
    selftext,
    url
  } = req.body
  console.log('Generating video...');
  // spawn new child process to call the python script
  const python = spawn('python', ['createvideo.py', selftext]);
  // collect data from script
  python.stdout.on('data', function (data) {
    console.log('Video generated', data.toString());
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    let description = `${selftext} ${url}`
    uploadVideo(title, description, res)
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})