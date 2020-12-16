const express = require('express');
const path = require('path');
const router = express.Router();
const { User, UserDetail, Cv, CvDetail, Experience, ExperienceDetail } = require('../model');
const { Regex } = require('../enum');

const CrudController = require('../controllers/crud.controller');
const cvController = new CrudController(Cv, [
  { 
    model: User,
    eager: true,
    include: [
      {
        model: UserDetail,
        as: 'details',
      }
    ]
  },
  { model: CvDetail, eager: true, as: 'details' },
  { model: Experience, eager: true, include: [
    { model: ExperienceDetail, as: 'details' }
  ] },
]);

const check = require('../middleware/validation/check');
const { QueryCommon } = require('../middleware/validation/schemas');
const { verifyAdmin } = require('../middleware/auth');

router.get(`/`, check(QueryCommon), cvController.readMany);
router.post(`/`, cvController.create);

// router.get(`/1`, (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../public/cv', 'document.json'));
// });
router.get(`/:cvId(${Regex.positiveInt})`, cvController.readOne);
router.patch(`/:cvId(${Regex.positiveInt})`, cvController.update);
router.delete(`/:cvId(${Regex.positiveInt})`, cvController.destroy);

router.get(`/:cvId(${Regex.positiveInt})/details`, cvController.getCvDetails);
router.post(`/:cvId(${Regex.positiveInt})/details`, cvController.createCvDetail);
router.get(`/:cvId(${Regex.positiveInt})/details/:cvDetailId`, cvController.getCvDetail);
router.patch(`/:cvId(${Regex.positiveInt})/details/:cvDetailId`, cvController.updateCvDetail);
router.delete(`/:cvId(${Regex.positiveInt})/details/:cvDetailId`, cvController.removeCvDetail);

router.get(`/:cvId(${Regex.positiveInt})/experiences`, cvController.getExperiences);
router.post(`/:cvId(${Regex.positiveInt})/experiences`, cvController.createExperience);
router.get(`/:cvId(${Regex.positiveInt})/experiences/:experienceId`, cvController.getExperience);
router.patch(`/:cvId(${Regex.positiveInt})/experiences/:experienceId`, cvController.updateExperience);
router.delete(`/:cvId(${Regex.positiveInt})/experiences/:experienceId`, cvController.removeExperience);

module.exports = router;
