const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const multer = require('multer');
const path = require('path');

const storageQuestions = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'question_files/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const uniqueFileName = `${timestamp}_${randomId}${ext}`;

    cb(null, uniqueFileName);
  }
});

const storageProf = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'profile_pictures/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const questionsUpload = multer({ storage: storageQuestions });
const profUpload = multer({ storage: storageProf });

app.get('/', (req, res) => {
  res.send("Serwerek ;)");
});

app.post('/api/uploadQuestions', questionsUpload.single('file'), (req, res) => {
  console.log('Odebrany plik:', req.file);
});

app.post('/api/uploadProfs', profUpload.single('prof'), (req, res) => {
  console.log('Odebrane zdięcie:', req.originalname);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`aplikacja działa na porcie ${port}`);
});
