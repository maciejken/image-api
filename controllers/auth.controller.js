const authService = require('../services/auth.service');
const Regex = require('../enum/regex.enum');
const { StatusCodeError } = require('../middleware/errors');

module.exports = {
  verifyIdToken(req, res, next) {
    const auth = req.headers.authorization;
    if (new RegExp(Regex.BearerAuth).test(auth)) {
      try {
        const token = auth.replace('Bearer ', '');
        const verifiedToken = authService.verifyIdToken(token);
        res.status(200).json(verifiedToken);        
      } catch (err) {
        next(new StatusCodeError(err.message, 403));
      }
    } else {
      res.set('WWW-Authenticate', 'Bearer')
      next(new StatusCodeError(`unauthorized`, 401));
    }
  },
  getIdToken(req, res, next) {
    const auth = req.headers.authorization;
    if (new RegExp(Regex.BasicAuth).test(auth)) {
      const authBase64 = auth.replace('Basic ', '');
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
    } else {
      res.set('WWW-Authenticate', 'Basic');
      next(new StatusCodeError(`unauthorized`, 401));
    }
  },
};
