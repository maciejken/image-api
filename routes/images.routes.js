const express = require('express');
const router = express.Router();

const { ImageSettings } = require('../config');
const CrudController = require('../controllers/crud.controller');
const imageController = new CrudController(ImageSettings);

const { verifyToken, verifyAdmin } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewImageData, ImageData } = require('../middleware/validation/schemas');

router.get(`/`, check(QueryCommon), verifyToken, imageController.getMany)
router.post(`/`, check(NewImageData), verifyToken, imageController.create);
  
router.get(`/:filename`, verifyToken, imageController.getOne);
router.patch(`/:filename`, check(ImageData), verifyAdmin, imageController.update);
router.delete(`/:filename`, verifyAdmin, imageController.remove);

router.get(`/:filename/details`, verifyToken, imageController.getImageDetails);
router.post(`/:filename/details`, verifyAdmin, imageController.createImageDetails);
router.get(`/:filename/details/:detailId`, verifyToken, imageController.getImageDetail);
router.patch(`/:filename/details/:detailId`, verifyAdmin, imageController.updateImageDetail);
router.delete(`/:filename/details/:detailId`, verifyAdmin, imageController.removeImageDetail);

module.exports = router;
