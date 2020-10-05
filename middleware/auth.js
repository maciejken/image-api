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
  verifyAdmin(req, res, next) {
    try {
      const token = requestUtil.getAccessToken(req);
      const verifiedToken = authService.verifyToken(token);
      res.locals.userId = verifiedToken.sub;
      if (verifiedToken.admin) {
        next();
      } else {
        next(new CustomError(
          `user ${verifiedToken.sub} not permitted to ${req.method} ${req.originalUrl}`,
          403
        ));
      }
    } catch (err) {
      next(err);
    }
  },
};
