const express = require('express');
const path = require('path');
const router = express.Router();
const { ExperienceSettings } = require('../config');
const { Regex } = require('../enum');

const CrudController = require('../controllers/crud.controller');
const expController = new CrudController(ExperienceSettings);

const check = require('../middleware/validation/check');
const { QueryCommon } = require('../middleware/validation/schemas');
const { verifyGroup } = require('../middleware/auth');

router.get(`/`, check(QueryCommon), expController.getMany);
router.post(`/`, expController.create);

router.get(`/:id(${Regex.positiveInt})`, expController.getOne);
router.patch(`/:id(${Regex.positiveInt})`, expController.update);
router.delete(`/:id(${Regex.positiveInt})`, expController.remove);

router.get(`/:id(${Regex.positiveInt})/details`, expController.getExperienceDetails);
router.post(`/:id(${Regex.positiveInt})/details`, expController.createExperienceDetails);
router.get(`/:id(${Regex.positiveInt})/details/:detailId`, expController.getExperienceDetail);
router.patch(`/:id(${Regex.positiveInt})/details/:detailId`, expController.updateExperienceDetail);
router.delete(`/:id(${Regex.positiveInt})/details/:detailId`, expController.removeExperienceDetail);

module.exports = router;
