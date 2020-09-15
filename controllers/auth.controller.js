const authService = require('../services/auth.service');
const Regex = require('../enum/regex.enum');
const CustomError = require('../middleware/errors/custom-error');

function verifyBearerToken(auth) {
  if (new RegExp(Regex.BearerAuth).test(auth)) {
    try {
      const token = auth.replace('Bearer ', '');
      return authService.verifyIdToken(token);      
    } catch (err) {
      throw new CustomError(err.message, 403);
    }
  } else {
    throw new CustomError(`unauthorized`, 401, ['WWW-Authenticate', 'Bearer']);
  }
}

module.exports = {
  verifyIdToken(req, res, next) {
    try {
      const verifiedToken = verifyBearerToken(req.headers.authorization);
      res.status(200).json(verifiedToken);        
    } catch (err) {
      next(err);
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
          throw new CustomError('incorrect username or password', 403);
        }
      })
      .catch(next);
    } else {
      next(new CustomError(`unauthorized`, 401, ['WWW-Authenticate', 'Basic']));
    }
  },
};
