const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/upload.controller');
const { UploadQuery } = require('../middleware/validation/schemas');
const { verifyGroup, verifyUser } = require('../middleware/auth');
const upload = require('../middleware/upload');
const thumbnail = require('../middleware/thumbnail');
const readExif = require('../middleware/read-exif');

const uploadField = process.env.IMAGE_UPLOAD_FIELD_NAME;

router.post(`/`,
  check(UploadQuery),
  verifyGroup,
  upload.array(uploadField),
  thumbnail,
  readExif,
  uploadController.createImages
);
router.get(`/:filename`, verifyUser, uploadController.getMediumSizeImage);
router.get(`/:filename/thumbnail`, verifyUser, uploadController.getThumbnail);
router.get(`/:filename/full-size`, verifyGroup, uploadController.getFullSizeImage);
router.delete(`/:filename`, verifyGroup, uploadController.removeImage);

module.exports = router;
