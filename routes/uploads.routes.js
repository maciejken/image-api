const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/upload.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const thumbnail = require('../middleware/thumbnail');
const readExif = require('../middleware/read-exif');
const { uploadField } = require('../config');
const check = require('../middleware/validation/check');
const { ParamFilename } = require('../middleware/validation/schemas');

router.post(`/public`, verifyAdmin, upload.array(uploadField), uploadController.getUploadInfo);
router.post(`/`,
  verifyToken,
  upload.array(uploadField),
  thumbnail,
  readExif,
  uploadController.createImages
);
router.delete(`/`, verifyAdmin, uploadController.removeUploads);
// router.delete(`/`, check(BodyFilename), verifyAdmin, uploadController.removeUploads);

router.get(`/:filename`, verifyToken, uploadController.getMediumSizeImage);
router.delete(`/:filename`, verifyAdmin, uploadController.removeUploads);

router.get(`/:filename/thumbnail`, check(ParamFilename), verifyToken, uploadController.getThumbnail);
router.get(`/:filename/full-size`, verifyAdmin, uploadController.getFullSizeImage);

module.exports = router;
