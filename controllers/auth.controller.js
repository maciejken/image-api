const authService = require('../services/auth.service');
const { StatusCodeError } = require('../middleware/errors');

module.exports = {
  verifyIdToken(req, res, next) {
    try {
      const token = req.headers['Authorization'].replace('Bearer ', '');
      const verifiedToken = authService.verifyIdToken(token);
      res.status(200).json(verifiedToken);        
    } catch (err) {
      next(new StatusCodeError(err.message, 403));
    }
  },
  getIdToken(req, res, next) {
    const authBase64 = req.headers['Authorization'].replace('Basic ', '');
    const [email, password] = Buffer.from(authBase64, 'base64')
      .toString('ascii')
      .split(':');
    authService.getIdToken(email, password).then(token => {
      if (token) {
        res.status(200).send(token);
      } else {
        throw new StatusCodeError('incorrect username or password', 403);
      }
    })
    .catch(next);
  },
};
