const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/upload.controller');
const { verifyAdmin, verifyUser } = require('../middleware/auth');
const upload = require('../middleware/upload');
const thumbnail = require('../middleware/thumbnail');
const readExif = require('../middleware/read-exif');

const uploadField = process.env.IMAGE_UPLOAD_FIELD_NAME;

router.get(`/:filename`, verifyUser, uploadController.getMediumSizeImage);
router.get(`/:filename/thumbnail`, verifyUser, uploadController.getThumbnail);
router.get(`/:filename/full-size`, verifyUser, uploadController.getFullSizeImage);
router.delete(`/:filename`, verifyAdmin, uploadController.removeImage);
router.post(`/`, verifyUser, upload.array(uploadField), thumbnail, readExif, uploadController.createImages);

module.exports = router;
