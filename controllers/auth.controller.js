const authService = require('../services/auth.service');
const requestUtil = require('../utils/request.util');

module.exports = {
  verifyIdToken(req, res, next) {
    try {
      const token = requestUtil.getAccessToken(req);
      const verifiedToken = authService.verifyToken(token);
      res.status(200).json(verifiedToken);        
    } catch (err) {
      next(err);
    }
  },
  async getIdToken(req, res, next) {
    try {
      const { authorization } = req.headers;
      const token = await authService.getIdToken(authorization && authorization.replace('Basic ',''));
      const expires = new Date(Date.now() + parseInt(process.env.ID_TOKEN_EXPIRES_IN));
      res.cookie('authorization', `Bearer ${token}`, { expires, sameSite: true, secure: true });
      res.cookie('authExpiration', expires.getTime(), { expires, sameSite: true });
      res.status(200).send(token);
    } catch (err) {
      next(err);
    }
  },
};
