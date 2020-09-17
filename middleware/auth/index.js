const authService = require('../../services/auth.service');
const CustomError = require('../errors/custom-error');

module.exports = {
  verifyUser(req, res, next) {
    try {
      authService.verifyBearerToken(req.headers.authorization);
      next();
    } catch (err) {
      next(err);
    }
  },
  verifyAdmin(req, res, next) {
    try {
      const token = authService.verifyBearerToken(req.headers.authorization);
      if (token.admin) {
        next();
      } else {
        next(new CustomError(`user ${token.sub} not permitted to ${req.method} ${req.originalUrl}`, 403));
      }
    } catch (err) {
      next(err);
    }
  },
};
