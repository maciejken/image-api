const authService = require('../services/auth.service');
const CustomError = require('./errors/custom-error');
const requestUtil = require('../utils/request.util');

function processToken(req, res) {
  const token = requestUtil.getAccessToken(req);
  const verifiedToken = authService.verifyToken(token);
  const { groups, sub } = verifiedToken;
  res.locals.userId = parseInt(sub);
  res.locals.groups = groups;
}

module.exports = {
  verifyUser(req, res, next) {
    try {
      processToken(req, res);
      next();
    } catch (err) {
      next(err);
    }
  },
  verifyUserGroup(req, res, next) {
    try {
      const groupId = parseInt(req.query.groupId);
      processToken(req, res);
      const { groups, userId } = res.locals;
      if (groups.includes(groupId)) {
        next();
      } else {
        throw new CustomError(`user ${userId} is not member of group ${groupId}`, 403);
      }
    } catch (err) {
      next(err);
    }
  },
  verifyAdmin(req, res, next) {
    try {
      processToken(req, res);
      const { groups } = res.locals;
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
