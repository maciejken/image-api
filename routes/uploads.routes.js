const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/upload.controller');
const check = require('../middleware/validation/check');
const { UploadQuery } = require('../middleware/validation/schemas');
const { verify, verifyAdmin, verifyUser } = require('../middleware/auth');
const upload = require('../middleware/upload');
const thumbnail = require('../middleware/thumbnail');
const readExif = require('../middleware/read-exif');
const { uploadField } = require('../config');

router.post(`/public`, verifyAdmin, upload.array(uploadField), uploadController.getUploadInfo);
router.post(`/`,
  check(UploadQuery),
  verifyUser,
  upload.array(uploadField),
  thumbnail,
  readExif,
  uploadController.createImages
);
router.get(`/:filename`, verify, uploadController.getMediumSizeImage);
router.get(`/:filename/thumbnail`, verify, uploadController.getThumbnail);
router.get(`/:filename/full-size`, verify, uploadController.getFullSizeImage);
router.delete(`/:filename`, verifyAdmin, uploadController.removeImage);

module.exports = router;
