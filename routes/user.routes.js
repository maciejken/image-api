const express = require('express');
const router = express.Router();

const { User, Cv, Group } = require('../model');
const { Regex, Tables } = require('../enum');
const CrudController = require('../controllers/crud.controller');
const userController = new CrudController(User, [
  { model: Cv },
  { model: Group, through: Tables.UserGroup },
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

module.exports = router;
