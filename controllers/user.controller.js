const userService = require('../services/user.service');
const Regex = require('../enum/regex.enum');
const CustomError = require('../middleware/errors/custom-error');
const groupService = require('../services/group.service');

module.exports = {
  async getUsers(req, res, next) {
    try {
      const { order, page, size } = req.query;
      const users = await userService.getUsers({ order, page, size });
      res.status(200).json(users);      
    } catch (err) {
      next(err);
    }
  },
  async getUser(req, res, next) {
    try {
      const user = await userService.getUser(req.params.userId);
      res.status(200).json(user);      
    } catch (err) {
      next(err);
    }
  },
  async createUser(req, res, next) {
    try {
      if (new RegExp(Regex.localAddress).test(req.ip)) {
        const { email, password } = req.body;
        const user = await userService.createUser({ email, password });
        res.status(200).json(user);
      } else {
        throw new CustomError(`creating users remotely is not supported`, 400);
      }
    } catch (err) {
      next(err);
    }
  },
  async updateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { email, password } = req.body;
      const user = await userService.updateUser(userId, { email, password });
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
  async removeUser(req, res, next) {
    try {
      const result = await userService.removeUser(req.params.userId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
  async addUserToGroup(req, res, next) {
    try {
      const user = await userService.getUser(req.params.userId);
      const group = await groupService.getGroup(req.query.groupId);
      const result = await user.addGroup(group);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
};
