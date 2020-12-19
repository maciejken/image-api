const express = require('express');
const router = express.Router();

const { GroupSettings } = require('../config');
const { Regex } = require('../enum');
const CrudController = require('../controllers/crud.controller');
const groupController = new CrudController(GroupSettings);

const { verifyAdmin } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewGroupData, GroupData } = require('../middleware/validation/schemas');

router.get(`/`, check(QueryCommon), verifyAdmin, groupController.getMany)
router.post(`/`, check(NewGroupData), verifyAdmin, groupController.create);
  
router.get(`/:id(${Regex.positiveInt})`, verifyAdmin, groupController.getOne);
router.patch(`/:id(${Regex.positiveInt})`, check(GroupData), verifyAdmin, groupController.update);
router.delete(`/:id(${Regex.positiveInt})`, verifyAdmin, groupController.remove);

router.get(`/:id(${Regex.positiveInt})/details`, verifyAdmin, groupController.getGroupDetails);
router.post(`/:id(${Regex.positiveInt})/details`, verifyAdmin, groupController.createGroupDetails);
router.get(`/:id(${Regex.positiveInt})/details/:detailId`, verifyAdmin, groupController.getGroupDetail);
router.patch(`/:id(${Regex.positiveInt})/details/:detailId`, verifyAdmin, groupController.updateGroupDetail);
router.delete(`/:id(${Regex.positiveInt})/details/:detailId`, verifyAdmin, groupController.removeGroupDetail);

module.exports = router;
