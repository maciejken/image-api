const authService = require('../services/auth.service');

module.exports = {
  verifyIdToken(req, res, next) {
    try {
      const { access_token } = req.cookies;
      const { authorization } = req.headers;
      const token = access_token || authorization && authorization.replace('Bearer ', '');
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
      res.cookie('access_token', token, { expires });
      res.status(200).send(token);
    } catch (err) {
      next(err);
    }
  },
};
