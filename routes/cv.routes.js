const express = require('express');
const path = require('path');
const router = express.Router();
const { User, Cv, Skill, Experience, Note } = require('../model');
const { Regex, Tables } = require('../enum');

const CrudController = require('../controllers/crud.controller');
const cvController = new CrudController(Cv, [
  { model: User },
  { model: Note, through: Tables.CvNote },
  { model: Skill, through: Tables.CvSkill },
  { model: Experience, through: Tables.CvExperience },
]);

const check = require('../middleware/validation/check');
const { QueryCommon } = require('../middleware/validation/schemas');
const { verifyAdmin } = require('../middleware/auth');

router.get(`/`, check(QueryCommon), cvController.readMany);
router.post(`/`, cvController.create);

router.get(`/1`, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/cv', 'document.json'));
});
router.get(`/:id(${Regex.positiveInt})`, cvController.readOne);
router.patch(`/:id(${Regex.positiveInt})`, verifyAdmin, cvController.update);
router.delete(`/:id(${Regex.positiveInt})`, verifyAdmin, cvController.destroy);

router.post(`/:id(${Regex.positiveInt})/skills`, verifyAdmin, cvController.createSkill);
router.delete(`/:id(${Regex.positiveInt})/skills/:skillId`, verifyAdmin, cvController.removeSkill);

router.post(`/:id(${Regex.positiveInt})/experiences`, verifyAdmin, cvController.createExperience);
router.delete(`/:id(${Regex.positiveInt})/experiences/:experienceId`,
  verifyAdmin, cvController.removeExperience);

module.exports = router;
