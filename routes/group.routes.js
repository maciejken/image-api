const express = require('express');
const router = express.Router();

const { Group, GroupDetail } = require('../model');
const { Regex } = require('../enum');
const CrudController = require('../controllers/crud.controller');
const groupController = new CrudController(Group, [
  { model: GroupDetail, eager: true, as: 'details' },
]);

const { verifyAdmin } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewGroupData, GroupData } = require('../middleware/validation/schemas');

router.get(`/`, check(QueryCommon), verifyAdmin, groupController.readMany)
router.post(`/`, check(NewGroupData), groupController.create);
  
router.get(`/:groupId(${Regex.positiveInt})`, groupController.readOne);
router.patch(`/:groupId(${Regex.positiveInt})`, check(GroupData), verifyAdmin, groupController.update);
router.delete(`/:groupId(${Regex.positiveInt})`, verifyAdmin, groupController.destroy);

router.get(`/:groupId(${Regex.positiveInt})/details`, groupController.getGroupDetails);
router.post(`/:groupId(${Regex.positiveInt})/details`, groupController.createGroupDetail);
router.get(`/:groupId(${Regex.positiveInt})/details/:groupDetailId`, groupController.getGroupDetail);
router.patch(`/:groupId(${Regex.positiveInt})/details/:groupDetailId`, groupController.updateGroupDetail);
router.delete(`/:groupId(${Regex.positiveInt})/details/:groupDetailId`, groupController.removeGroupDetail);

module.exports = router;
