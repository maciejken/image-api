const express = require('express');
const router = express.Router();

const { UserSettings } = require('../config');
const { Regex } = require('../enum');
const CrudController = require('../controllers/crud.controller');
const userController = new CrudController(UserSettings);
const uploadController = require('../controllers/upload.controller');

const { verifyAdmin, verifyAddress, verifyGroup, verifyUser } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewUserData, UserData } = require('../middleware/validation/schemas');

router.get(`/`, check(QueryCommon), verifyAdmin, userController.getMany)
router.post(`/`, check(NewUserData), verifyAddress, userController.create);
router.get(`/:id(${Regex.positiveInt})`, verifyUser, userController.getOne);
router.patch(`/:id(${Regex.positiveInt})`, check(UserData), verifyUser, userController.update);
router.delete(`/:id(${Regex.positiveInt})`, verifyUser, userController.remove);

router.get(`/:id(${Regex.positiveInt})/groups`, verifyUser, userController.getGroups);
router.get(
  `/:id(${Regex.positiveInt})/groups/:groupId(${Regex.positiveInt})`,
  verifyUser, verifyGroup,
  userController.getGroup
);
router.delete(
  `/:id(${Regex.positiveInt})/groups/:groupId(${Regex.positiveInt})`,
  verifyUser, verifyGroup,
  userController.removeGroup,
);

router.get(`/:id(${Regex.positiveInt})/details`, verifyUser, userController.getUserDetails);
router.post(`/:id(${Regex.positiveInt})/details`, verifyUser, userController.createUserDetails);
router.get(`/:id(${Regex.positiveInt})/details/:detailId`, verifyUser, userController.getUserDetail);
router.patch(`/:id(${Regex.positiveInt})/details/:detailId`, verifyUser, userController.updateUserDetail);
router.delete(`/:id(${Regex.positiveInt})/details/:detailId`, verifyUser, userController.removeUserDetail);

router.get(`/:id(${Regex.positiveInt})/cv`, check(QueryCommon), verifyUser, userController.getCvs);
router.post(`/:id(${Regex.positiveInt})/cv`, verifyUser, userController.createCvs);
router.get(`/:id(${Regex.positiveInt})/cv/:cvId`, verifyUser, userController.getCv);
router.patch(`/:id(${Regex.positiveInt})/cv/:cvId`, verifyUser, userController.updateCv);
router.delete(`/:id(${Regex.positiveInt})/cv/:cvId`, verifyUser, userController.removeCv);

// create as group to share with other group members (read-only), edit and remove as user
router.patch(`/:id(${Regex.positiveInt})/images/:filename`, verifyUser, userController.updateImage);
router.delete(`/:id(${Regex.positiveInt})/uploads/:filename`, verifyUser, uploadController.removeImage);

module.exports = router;
