const multer = require('multer');
const path = require('path');


// Configure storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Destination folder to store uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname);
  }
});


const storageforTiolet = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/ToiletFile');  // Destination folder to store uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname);
  }
});


// Create multer instance with storage configuration
const upload = multer({ storage: storage });
const uploadForTiolet = multer({storage : storageforTiolet})

module.exports = {upload,uploadForTiolet}
