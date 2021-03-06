const authService = require('../services/auth.service');
const requestUtil = require('../utils/request.util');
const CustomError = require('../middleware/errors/custom-error');

function authorize(res, token) {
  const expires = new Date(Date.now() + process.env.ID_TOKEN_VALIDITY_SECONDS * 1000);
  res.cookie('authorization', `Bearer ${token}`, { expires, sameSite: true, secure: true });
  res.cookie('authExpires', expires.getTime(), { expires, sameSite: true });
  const jwt = authService.verifyToken(token);
  res.cookie('userId', jwt.sub, { expires, sameSite: true });
  res.cookie('userGroups', jwt.groups, { expires, sameSite: true });
  res.status(200).send({ expires: expires.getTime(), user: jwt.sub, groups: jwt.groups });
}

module.exports = {
  async getIdToken(req, res, next) {
    try {
      const oldToken = requestUtil.getAccessToken(req);
      if (oldToken) {
        const token = await authService.refreshToken(oldToken);
        authorize(res, token);
      } else {
        const { authorization } = req.headers;
        if (authorization) {
          const token = await authService.getTokenFromBasic(authorization.replace('Basic ',''));
          authorize(res, token);
        } else {
          throw new CustomError(`unauthorized`, 401, ['WWW-Authenticate', 'Basic']);
        }
      }
    } catch (err) {
      next(err);
    }
  },
};
