const express = require('express');
const router = express.Router();

const imageController = require('../controllers/image.controller');
const check = require('../middleware/validation/check');
const { QueryCommon, NewImageData, ImageData } = require('../middleware/validation/schemas');
const { verifyImageGroup, verifyImageUser, verifyUser } = require('../middleware/auth');

router.get(`/`, check(QueryCommon), verifyUser, imageController.getImages);
router.post(`/`, check(NewImageData), verifyUser, imageController.createImage);

router.get(`/:filename`, verifyUser, imageController.getImage);
router.patch(`/:filename`, check(ImageData), verifyImageGroup, imageController.updateImage);
router.delete(`/:filename`, verifyImageUser, imageController.removeImage);

module.exports = router;
