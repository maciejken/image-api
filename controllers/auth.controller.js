const authService = require('../services/auth.service');

module.exports = {
  verifyIdToken(req, res, next) {
    try {
      const token = authService.verifyBearerToken(req.headers.authorization);
      res.status(200).json(token);        
    } catch (err) {
      next(err);
    }
  },
  async getIdToken(req, res, next) {
    try {
      const token = await authService.getIdToken(req.headers.authorization);
      res.status(200).send(token);
    } catch (err) {
      next(err);
    }
  },
};
