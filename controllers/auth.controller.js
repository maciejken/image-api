const authService = require('../services/auth.service');
const requestUtil = require('../utils/request.util');
const CustomError = require('../middleware/errors/custom-error');

function authorize(res, token) {
  const expires = new Date(Date.now() + process.env.ID_TOKEN_VALIDITY_SECONDS * 1000);
  res.cookie('authorization', `Bearer ${token}`, { expires, sameSite: true, secure: true });
  res.cookie('authExpiration', expires.getTime(), { expires, sameSite: true });
  res.status(200).send(token);
}

module.exports = {
  verifyIdToken(req, res, next) {
    try {
      const token = requestUtil.getAccessToken(req);
      if (token) {
        const verifiedToken = authService.verifyToken(token);
        res.status(200).json(verifiedToken);        
      } else {
        throw new CustomError(`unauthorized`, 401, ['WWW-Authenticate', 'Bearer']);
      }
    } catch (err) {
      next(err);
    }
  },
  async getIdToken(req, res, next) {
    try {
      const oldToken = requestUtil.getAccessToken(req);
      if (oldToken) {
        const token = authService.refreshToken(oldToken);
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
