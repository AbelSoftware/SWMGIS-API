const multer = require('multer');
const path = require('path');
const fs=require('fs')

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

const storageForLayers = multer.diskStorage({
  destination: function (req, file, cb) {
    // Extract `LayerName` from the request body
    const layerName = req.body.LayerName || 'default';

    // Create a dynamic directory path based on `LayerName`
    const folderPath = path.join('uploads', layerName);

    // Check if the folder exists, and create it if it doesn't
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Pass the dynamic folder path to multer
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    // Generate a timestamp-based unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.originalname); // Get the file extension
    const baseName = path.basename(file.originalname, ext); // Get the file name without extension

    // Append the timestamp to the filename
    const uniqueFilename = `${baseName}-${timestamp}${ext}`;

    // Pass the unique filename to multer
    cb(null, uniqueFilename);
  }
});

// Create multer instance with storage configuration
const upload = multer({ storage: storage });
const uploadForTiolet = multer({storage : storageforTiolet})
const uploadForLayers=multer({storage:storageForLayers})
module.exports = {upload,uploadForTiolet,uploadForLayers}
