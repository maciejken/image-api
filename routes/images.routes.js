const express = require('express');
const router = express.Router();

const { ImageSettings } = require('../config');
const CrudController = require('../controllers/crud.controller');
const imageController = new CrudController(ImageSettings);

const { verifyAdmin } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewImageData, ImageData } = require('../middleware/validation/schemas');

router.get(`/`, check(QueryCommon), verifyAdmin, imageController.getMany)
router.post(`/`, check(NewImageData), verifyAdmin, imageController.create);
  
router.get(`/:filename`, verifyAdmin, imageController.getOne);
router.patch(`/:filename`, check(ImageData), verifyAdmin, imageController.update);
router.delete(`/:filename`, verifyAdmin, imageController.remove);

router.get(`/:filename/details`, verifyAdmin, imageController.getImageDetails);
router.post(`/:filename/details`, verifyAdmin, imageController.createImageDetail);
router.get(`/:filename/details/:detailId`, verifyAdmin, imageController.getImageDetail);
router.patch(`/:filename/details/:detailId`, verifyAdmin, imageController.updateImageDetail);
router.delete(`/:filename/details/:detailId`, verifyAdmin, imageController.removeImageDetail);

module.exports = router;
