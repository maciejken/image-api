const express = require('express');
const router = express.Router();

const groupController = require('../controllers/group.controller');
const check = require('../middleware/validation/check');
const { QueryCommon, NewGroupData, GroupData } = require('../middleware/validation/schemas');
const { verifyAdmin } = require('../middleware/auth');
const { Regex } = require('../enum');

router.get(`/`, check(QueryCommon), verifyAdmin, groupController.getGroups);
router.post(`/`, check(NewGroupData), verifyAdmin, groupController.createGroup);

router.get(`/:groupId(${Regex.positiveInt})`, verifyAdmin, groupController.getGroup);
router.post(`/:groupId(${Regex.positiveInt})`, verifyAdmin, groupController.addUserToGroup);
router.patch(`/:groupId(${Regex.positiveInt})`, check(GroupData), verifyAdmin, groupController.updateGroup);
router.delete(`/:groupId(${Regex.positiveInt})`, verifyAdmin, groupController.removeGroup);

module.exports = router;
