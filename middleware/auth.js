const authService = require('../services/auth.service');
const imageService = require('../services/image.service');
const CustomError = require('./errors/custom-error');
const requestUtil = require('../utils/request.util');

const notPermittedError = new CustomError(`unable to perform requested operation`, 403);

function processToken(req, res) {
  const token = requestUtil.getAccessToken(req);
  const verifiedToken = authService.verifyToken(token);
  const { groups, sub } = verifiedToken;
  res.locals.userId = parseInt(sub);
  res.locals.groups = groups;
}

function canAuthorize(groups, groupId) {
  const adminGroupId = parseInt(process.env.ADMIN_GROUP_ID);
  return Array.isArray(groups)
    && (groups.includes(groupId) || groups.includes(adminGroupId));
}

module.exports = {
  verifyUser(req, res, next) {
    try {
      processToken(req, res);
      next();
    } catch (err) {
      next(notPermittedError);
    }
  },
  verifyQueryGroup(req, res, next) {
    try {
      processToken(req, res);
      const { groups } = res.locals;
      const groupId = parseInt(req.query.groupId);
      if (canAuthorize(groups, groupId)) {
        next();
      } else {
        throw notPermittedError;
      }
    } catch (err) {
      next(err);
    }
  },
  async verifyImageUser(req, res, next) {
    try {
      processToken(req, res);
      const { userId } = res.locals;
      const image = await imageService.getImage(req.params.filename);
      if (image.userId === userId) {
        res.locals.image = image;
        next();
      } else {
        throw notPermittedError;
      }
    } catch (err) {
      next(err);
    }
  },
  async verifyImageGroup(req, res, next) {
    try {
      processToken(req, res);
      const { groups } = res.locals;
      const image = await imageService.getImage(req.params.filename);
      if (canAuthorize(groups, image.groupId)) {
        res.locals.image = image;
        next();
      } else {
        throw notPermittedError;
      }
    } catch (err) {
      next(err);
    }
  },
  verifyAdmin(req, res, next) {
    try {
      processToken(req, res);
      const { groups } = res.locals;
      if (canAuthorize(groups)) {
        next();
      } else {
        throw notPermittedError;
      }
    } catch (err) {
      next(err);
    }
  },
};
