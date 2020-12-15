const express = require('express');
const router = express.Router();

const { User, Group, Detail, Image, Cv, Experience } = require('../model');
const { Regex, Tables } = require('../enum');
const CrudController = require('../controllers/crud.controller');
const userController = new CrudController(User, [
  { model: Group, through: Tables.UserGroup, eager: true },
  { model: Detail, eager: true },
  { model: Image },
  { model: Cv, include: [Detail, { model: Experience, include: Detail }] },
]);
const cvController = new CrudController(Cv, [
  { model: User, eager: true },
  { model: Detail, eager: true },
  { model: Experience, eager: true },
]);

const { verifyAdmin } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewUserData, UserData } = require('../middleware/validation/schemas');

router.get(`/`, check(QueryCommon), verifyAdmin, userController.readMany)
router.post(`/`, check(NewUserData), userController.create);
  
router.get(`/:id(${Regex.positiveInt})`, verifyAdmin, userController.readOne);
router.patch(`/:id(${Regex.positiveInt})`, check(UserData), verifyAdmin, userController.update);
router.delete(`/:id(${Regex.positiveInt})`, verifyAdmin, userController.destroy);

router.post(`/:id(${Regex.positiveInt})/groups`, verifyAdmin, userController.createGroup);
// TODO:
// router.delete(
//   `/:id(${Regex.positiveInt})/groups/:groupId(${Regex.positiveInt})`,
//   verifyAdmin, userController.leaveGroup,
// );

router.post(`/:id(${Regex.positiveInt})/details`, userController.createDetail);
router.delete(`/:id(${Regex.positiveInt})/details/:detailId`, userController.removeDetail);

router.get(`/:id(${Regex.positiveInt})/cv`, check(QueryCommon), cvController.readMany);
router.post(`/:id(${Regex.positiveInt})/cv`, userController.createCv);

router.get(`/:id(${Regex.positiveInt})/cv/:cvId`, userController.getCv);
router.patch(`/:id(${Regex.positiveInt})/cv/:cvId`, cvController.update);
router.delete(`/:id(${Regex.positiveInt})/cv/:cvId`, cvController.destroy);

router.post(`/:id(${Regex.positiveInt})/cv/:cvId/details`, cvController.createDetail);
router.delete(
  `/:id(${Regex.positiveInt})/cv/:cvId/details/:detailId`,
  verifyAdmin, cvController.removeDetail
);

router.post(`/:id(${Regex.positiveInt})/cv/:cvId/experiences`, cvController.createExperience);
router.delete(
  `/:id(${Regex.positiveInt})/cv/:cvId/experiences/:experienceId`,
  verifyAdmin, cvController.removeExperience
);

module.exports = router;
