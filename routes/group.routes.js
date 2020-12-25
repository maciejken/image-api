const express = require('express');
const router = express.Router();

const { GroupSettings } = require('../config');
const { Regex } = require('../enum');
const CrudController = require('../controllers/crud.controller');
const groupController = new CrudController(GroupSettings);

const { verifyAdmin, verifyGroup, verifyUser } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewGroupData, GroupData } = require('../middleware/validation/schemas');

router.get(`/`, check(QueryCommon), verifyAdmin, groupController.getMany)
router.post(`/`, check(NewGroupData), verifyUser, groupController.create);
  
router.get(`/:id(${Regex.positiveInt})`, verifyGroup, groupController.getOne);
router.patch(`/:id(${Regex.positiveInt})`, check(GroupData), verifyGroup, groupController.update);
router.delete(`/:id(${Regex.positiveInt})`, verifyGroup, groupController.remove);

router.get(`/:id(${Regex.positiveInt})/details`, verifyGroup, groupController.getGroupDetails);
router.post(`/:id(${Regex.positiveInt})/details`, verifyGroup, groupController.createGroupDetails);
router.get(`/:id(${Regex.positiveInt})/details/:detailId`, verifyGroup, groupController.getGroupDetail);
router.patch(`/:id(${Regex.positiveInt})/details/:detailId`, verifyGroup, groupController.updateGroupDetail);
router.delete(`/:id(${Regex.positiveInt})/details/:detailId`, verifyGroup, groupController.removeGroupDetail);

router.get(`/:id(${Regex.positiveInt})/images`, verifyGroup, groupController.getImages);
router.post(`/:id(${Regex.positiveInt})/images`, verifyGroup, groupController.createImages);
router.get(`/:id(${Regex.positiveInt})/images/:filename`, verifyGroup, groupController.getImage);
router.patch(`/:id(${Regex.positiveInt})/images/:filename`, verifyGroup, groupController.updateImage);
router.delete(`/:id(${Regex.positiveInt})/images/:filename`, verifyGroup, groupController.removeImage);

module.exports = router;
