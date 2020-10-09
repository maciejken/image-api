const multer = require('multer');
const { pathToUploads } = require('../config');

const storage = multer.diskStorage({
  destination: pathToUploads,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const limits = {
  fileSize: 1024 * 1024 * 512
};
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({ storage, limits, fileFilter });

module.exports = upload;
