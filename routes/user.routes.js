const express = require('express');
const router = express.Router();

const { UserSettings } = require('../config');
const { Regex } = require('../enum');
const CrudController = require('../controllers/crud.controller');
const userController = new CrudController(UserSettings);

const { verifyAdmin } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewUserData, UserData } = require('../middleware/validation/schemas');

// TODO: add verifyUser (auth) middleware here
router.get(`/`, check(QueryCommon), verifyAdmin, userController.getMany)
router.post(`/`, check(NewUserData), userController.create);
router.get(`/:id(${Regex.positiveInt})`, userController.getOne);
router.patch(`/:id(${Regex.positiveInt})`, check(UserData), userController.update);
router.delete(`/:id(${Regex.positiveInt})`, userController.remove);

router.get(`/:id(${Regex.positiveInt})/groups`, userController.getGroups);
router.post(`/:id(${Regex.positiveInt})/groups`, verifyAdmin, userController.createGroup);
router.get(`/:id(${Regex.positiveInt})/groups/:groupId`, userController.getGroup);
router.patch(`/:id(${Regex.positiveInt})/groups/:groupId`, verifyAdmin, userController.updateGroup);
router.delete(
  `/:id(${Regex.positiveInt})/groups/:groupId(${Regex.positiveInt})`,
  userController.removeGroup,
);

router.get(`/:id(${Regex.positiveInt})/details`, userController.getUserDetails);
router.post(`/:id(${Regex.positiveInt})/details`, userController.createUserDetail);
router.get(`/:id(${Regex.positiveInt})/details/:detailId`, userController.getUserDetail);
router.patch(`/:id(${Regex.positiveInt})/details/:detailId`, userController.updateUserDetail);
router.delete(`/:id(${Regex.positiveInt})/details/:detailId`, userController.removeUserDetail);

router.get(`/:id(${Regex.positiveInt})/cv`, check(QueryCommon), userController.getCvs);
router.post(`/:id(${Regex.positiveInt})/cv`, userController.createCv);
router.get(`/:id(${Regex.positiveInt})/cv/:cvId`, userController.getCv);
router.patch(`/:id(${Regex.positiveInt})/cv/:cvId`, userController.updateCv);
router.delete(`/:id(${Regex.positiveInt})/cv/:cvId`, userController.removeCv);

module.exports = router;
