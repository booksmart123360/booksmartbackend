const multer = require("multer");
const fs = require("fs")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Upload/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Function to delete uploaded file
module.exports.deleteUploadedFile = (filePath) => {
  fs.unlink(filePath, (err) => {
      if (err) {
          console.error('Error deleting file:', err);
      } else {
          console.log('File deleted successfully:', filePath);
      }
  });
};

module.exports.Upload = upload;



