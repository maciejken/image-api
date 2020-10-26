const groupService = require('../services/group.service');
const userService = require('../services/user.service');
const Regex = require('../enum/regex.enum');
const CustomError = require('../middleware/errors/custom-error');

module.exports = {
  async getGroups(req, res, next) {
    try {
      const { order, page, size } = req.query;
      const groups = await groupService.getGroups({ order, page, size });
      res.status(200).json(groups);      
    } catch (err) {
      next(err);
    }
  },
  async getGroup(req, res, next) {
    try {
      const group = await groupService.getGroup(req.params.groupId);
      res.status(200).json(group);      
    } catch (err) {
      next(err);
    }
  },
  async createGroup(req, res, next) {
    try {
      if (new RegExp(Regex.localAddress).test(req.ip)) {
        const { name } = req.body;
        const group = await groupService.createGroup({ name });
        res.status(200).json(group);
      } else {
        throw new CustomError(`creating groups remotely is not supported`, 400);
      }
    } catch (err) {
      next(err);
    }
  },
  async updateGroup(req, res, next) {
    try {
      const { groupId } = req.params;
      const { name, description, totem } = req.body;
      const group = await groupService.updateGroup(groupId, { name, description, totem });
      res.status(200).json(group);
    } catch (err) {
      next(err);
    }
  },
  async removeGroup(req, res, next) {
    try {
      const result = await groupService.removeGroup(req.params.groupId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
  async addUserToGroup(req, res, next) {
    try {
      const user = await userService.getUser(req.query.userId);
      const group = await groupService.getGroup(req.params.groupId);
      const result = await user.addGroup(group);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
};
