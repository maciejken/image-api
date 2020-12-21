const express = require('express');
const router = express.Router();

const { ImageSettings } = require('../config');
const CrudController = require('../controllers/crud.controller');
const imageController = new CrudController(ImageSettings);

const { verify, verifyAdmin } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewImageData, ImageData } = require('../middleware/validation/schemas');

router.get(`/`, check(QueryCommon), verify, imageController.getMany)
router.post(`/`, check(NewImageData), verify, imageController.create);
  
router.get(`/:filename`, verify, imageController.getOne);
router.patch(`/:filename`, check(ImageData), verifyAdmin, imageController.update);
router.delete(`/:filename`, verifyAdmin, imageController.remove);

router.get(`/:filename/details`, verify, imageController.getImageDetails);
router.post(`/:filename/details`, verifyAdmin, imageController.createImageDetails);
router.get(`/:filename/details/:detailId`, verify, imageController.getImageDetail);
router.patch(`/:filename/details/:detailId`, verifyAdmin, imageController.updateImageDetail);
router.delete(`/:filename/details/:detailId`, verifyAdmin, imageController.removeImageDetail);

module.exports = router;
