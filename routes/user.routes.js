const express = require('express');
const router = express.Router();

const {
  User, UserDetail,
  Group,
  Image,
  Cv, CvDetail,
  Experience, ExperienceDetail,
} = require('../model');
const { Regex, Tables } = require('../enum');
const CrudController = require('../controllers/crud.controller');
const userController = new CrudController(User, [
  { model: Group, through: Tables.UserGroup, eager: true },
  { model: UserDetail, eager: true, as: 'details' },
  {
    model: Cv,
    include: [
      {
        model: User,
        include: [
          { model: UserDetail, as: 'details' }
        ]
      },
      { model: CvDetail, as: 'details' },
      {
        model: Experience,
        include: [
          { model: ExperienceDetail, as: 'details' }
        ]
      }
    ]
  },
]);

const { verifyAdmin } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewUserData, UserData } = require('../middleware/validation/schemas');

router.get(`/`, check(QueryCommon), verifyAdmin, userController.readMany)
router.post(`/`, check(NewUserData), userController.create);
  
router.get(`/:userId(${Regex.positiveInt})`, userController.readOne);
router.patch(`/:userId(${Regex.positiveInt})`, check(UserData), verifyAdmin, userController.update);
router.delete(`/:userId(${Regex.positiveInt})`, verifyAdmin, userController.destroy);

router.post(`/:userId(${Regex.positiveInt})/groups`, verifyAdmin, userController.createGroup);
router.delete(
  `/:userId(${Regex.positiveInt})/groups/:groupId(${Regex.positiveInt})`,
  verifyAdmin, userController.removeGroup,
);

router.get(`/:userId(${Regex.positiveInt})/details`, userController.getUserDetails);
router.post(`/:userId(${Regex.positiveInt})/details`, userController.createUserDetail);
router.get(`/:userId(${Regex.positiveInt})/details/:userDetailId`, userController.getUserDetail);
router.patch(`/:userId(${Regex.positiveInt})/details/:userDetailId`, userController.updateUserDetail);
router.delete(`/:userId(${Regex.positiveInt})/details/:userDetailId`, userController.removeUserDetail);

router.get(`/:userId(${Regex.positiveInt})/cv`, check(QueryCommon), userController.getCvs);
router.post(`/:userId(${Regex.positiveInt})/cv`, userController.createCv);
router.get(`/:userId(${Regex.positiveInt})/cv/:cvId`, userController.getCv);
router.patch(`/:userId(${Regex.positiveInt})/cv/:cvId`, userController.updateCv);
router.delete(`/:userId(${Regex.positiveInt})/cv/:cvId`, userController.removeCv);

module.exports = router;
