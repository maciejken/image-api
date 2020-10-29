const authService = require('../services/auth.service');
const CustomError = require('./errors/custom-error');
const requestUtil = require('../utils/request.util');

module.exports = {
  verifyUser(req, res, next) {
    try {
      const token = requestUtil.getAccessToken(req);
      const verifiedToken = authService.verifyToken(token);
      res.locals.userId = verifiedToken.sub;
      next();
    } catch (err) {
      next(err);
    }
  },
  verifyGroup(req, res, next) {
    try {
      const { groupId } = req.query;
      const token = requestUtil.getAccessToken(req);
      const verifiedToken = authService.verifyToken(token);
      const { groups, sub } = verifiedToken;
      if (groups.includes(parseInt(groupId))) {
        res.locals.userId = sub;
        res.locals.userGroups = groups;        
        next();
      } else {
        throw new CustomError(`user ${sub} is not member of group ${groupId}`, 403);
      }
    } catch (err) {
      next(err);
    }
  },
  verifyAdmin(req, res, next) {
    try {
      const token = requestUtil.getAccessToken(req);
      const verifiedToken = authService.verifyToken(token);
      const { groups, sub } = verifiedToken;
      res.locals.userId = sub;
      res.locals.userGroups = groups;
      const adminGroupId = parseInt(process.env.ADMIN_GROUP_ID);
      const isAdmin = Array.isArray(groups) && groups.includes(adminGroupId);
      if (isAdmin) {
        next();
      } else {
        throw new CustomError(
          `user ${sub} not permitted to ${req.method} ${req.originalUrl}`,
          403
        );
      }
    } catch (err) {
      next(err);
    }
  },
};
