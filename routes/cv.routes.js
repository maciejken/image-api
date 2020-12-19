const express = require('express');
const path = require('path');
const router = express.Router();
const { CvSettings } = require('../config');
const { Regex } = require('../enum');

const CrudController = require('../controllers/crud.controller');
const cvController = new CrudController(CvSettings);

const check = require('../middleware/validation/check');
const { QueryCommon } = require('../middleware/validation/schemas');
const { verifyAdmin } = require('../middleware/auth');

router.get(`/`, check(QueryCommon), cvController.getMany);
router.post(`/`, cvController.create);

// router.get(`/1`, (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../public/cv', 'document.json'));
// });
router.get(`/:id(${Regex.positiveInt})`, cvController.getOne);
router.patch(`/:id(${Regex.positiveInt})`, cvController.update);
router.delete(`/:id(${Regex.positiveInt})`, cvController.remove);

router.get(`/:id(${Regex.positiveInt})/details`, cvController.getCvDetails);
router.post(`/:id(${Regex.positiveInt})/details`, cvController.createCvDetails);
router.get(`/:id(${Regex.positiveInt})/details/:detailId`, cvController.getCvDetail);
router.patch(`/:id(${Regex.positiveInt})/details/:detailId`, cvController.updateCvDetail);
router.delete(`/:id(${Regex.positiveInt})/details/:detailId`, cvController.removeCvDetail);

router.get(`/:id(${Regex.positiveInt})/experiences`, cvController.getExperiences);
router.post(`/:id(${Regex.positiveInt})/experiences`, cvController.createExperiences);
router.get(`/:id(${Regex.positiveInt})/experiences/:experienceId`, cvController.getExperience);
router.patch(`/:id(${Regex.positiveInt})/experiences/:experienceId`, cvController.updateExperience);
router.delete(`/:id(${Regex.positiveInt})/experiences/:experienceId`, cvController.removeExperience);

module.exports = router;
