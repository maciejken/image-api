const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads',
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

const uploadField = process.env.IMAGE_UPLOAD_FIELD_NAME;

const upload = multer({ storage, limits, fileFilter });

module.exports = {
  array: upload.array(uploadField),
  single: upload.single(uploadField),
};
