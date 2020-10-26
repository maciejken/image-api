const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { verifyAdmin } = require('../middleware/auth');
const check = require('../middleware/validation/check');
const { QueryCommon, NewUserData, UserData } = require('../middleware/validation/schemas');
const { Regex } = require('../enum');

router.get(`/`, check(QueryCommon), verifyAdmin, userController.getUsers)
router.post(`/`, check(NewUserData), userController.createUser);
  
router.get(`/:userId(${Regex.positiveInt})`, verifyAdmin, userController.getUser);
router.post(`/:userId(${Regex.positiveInt})`, verifyAdmin, userController.addUserToGroup);
router.patch(`/:userId(${Regex.positiveInt})`, check(UserData), verifyAdmin, userController.updateUser);
router.delete(`/:userId(${Regex.positiveInt})`, verifyAdmin, userController.removeUser);

module.exports = router;
