var AuthService = require('../services/auth.service');
var { StatusCodeError } = require('../middleware/errors');

var unauthorizedError = new StatusCodeError(`unauthorized`, 401);
var forbiddenError = new StatusCodeError(`forbidden`, 403);

var handleAuthError = (authType) => (req, res, next) => {
  res.set('WWW-Authenticate', authType);
  next(unauthorizedError);
}

var handleBasicAuthError = handleAuthError('Basic');
var handleBearerAuthError = handleAuthError('Bearer');

module.exports = {

  getIdToken(req, res, next) {
    if (!req.headers.authorization) {
      handleBasicAuthError(req, res, next);
    }
    var [authType, credentials] = req.headers.authorization.split(' ');
    if (authType === 'Bearer') {
      try {
        var verifiedToken = new AuthService().verifyIdToken(credentials);
        res.status(200).json(verifiedToken);        
      } catch (err) {
        next(new StatusCodeError(err.message, 403));
      }
    } else if (authType === 'Basic') {
      var [email, password] = Buffer.from(credentials, 'base64').toString('ascii').split(':');
      new AuthService().getIdToken(email, password)      
      .then(token => {
        if (token) {
          res.status(200).send(token);
        } else {
          throw forbiddenError;
        }
      })
      .catch(next);
    } else {
      handleBasicAuthError(req, res, next);
    }

  },

  allowAdmin(req, res, next) {
    if (!req.headers.authorization) {
      handleBearerAuthError(req, res, next);
    }
    const [authType, token] = req.headers.authorization.split(' ');
    if (authType === 'Bearer') {
      try {
        const { admin } = new AuthService().verifyIdToken(token);
        if (admin) {
          next();          
        } else {
          throw new Error();
        }  
      } catch (err) {
        next(forbiddenError);
      }
    } else {
      handleBearerAuthError(req, res, next);
    }
  },

  allowUser(req, res, next) {
    if (!req.headers.authorization) {
      handleBearerAuthError(req, res, next);
    }
    const [authType, token] = req.headers.authorization.split(' ');
    if (authType === 'Bearer') {
      try {
        const { admin, sub } = new AuthService().verifyIdToken(token);
        if (admin || sub === req.params.userId) {
          next();          
        } else {
          throw new Error();
        }  
      } catch (err) {
        next(forbiddenError);
      }
    } else {
      handleBearerAuthError(req, res, next);
    }
  }

};
