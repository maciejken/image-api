const express = require('express');
const path = require('path');
const router = express.Router();
const { Experience, ExperienceDetail } = require('../model');
const { Regex } = require('../enum');

const CrudController = require('../controllers/crud.controller');
const expController = new CrudController(Experience, [
  { model: ExperienceDetail, as: 'details', eager: true },
]);

const check = require('../middleware/validation/check');
const { QueryCommon } = require('../middleware/validation/schemas');
const { verifyAdmin } = require('../middleware/auth');

router.get(`/`, check(QueryCommon), expController.readMany);
router.post(`/`, expController.create);

router.get(`/:experienceId(${Regex.positiveInt})`, expController.readOne);
router.patch(`/:experienceId(${Regex.positiveInt})`, expController.update);
router.delete(`/:experienceId(${Regex.positiveInt})`, expController.destroy);

router.get(`/:experienceId(${Regex.positiveInt})/details`, expController.getExperienceDetails);
router.post(`/:experienceId(${Regex.positiveInt})/details`, expController.createExperienceDetail);
router.get(
  `/:experienceId(${Regex.positiveInt})/details/:experienceDetailId`,
  expController.getExperienceDetail
  );
router.patch(
  `/:experienceId(${Regex.positiveInt})/details/:experienceDetailId`,
  expController.updateExperienceDetail
);
router.delete(
  `/:experienceId(${Regex.positiveInt})/details/:experienceDetailId`,
  expController.removeExperienceDetail
);

module.exports = router;
