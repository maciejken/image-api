var logger = require('../../libs/logger')('server');

module.exports = function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const message = err.status ? err.message : 'Unknown server error';
  logger.error(err.stack);
  
  if (err.header) {
    res.set(...err.header);
  }
  res.status(err.status || 500).json({ message });
}
