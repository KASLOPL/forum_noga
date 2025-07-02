const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const multer = require('multer');
const storage_questions = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'question_files/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
})

const upload = multer({storage: storage_questions});

app.get('/', (req, res) => {
    res.send("Serwerek ;)");
});

app.post('/api/upload' ,upload.single('file') ,(req, res) => {
  console.log('Odebrany plik:', req.file);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`aplikacja działa na porcie ${port}`);
});
