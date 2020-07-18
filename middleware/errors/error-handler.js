var logger = require('../../libs/logger')('server');

module.exports = function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  let message;
  let stack;

  if (err.status) {
    message = err.message;
  } else {
    message = "Unknown server error";
  }

  stack = err.stack;
  logger.error(stack);
  res.status(err.status || 500).json({ message });
}
var logger = require('../../libs/logger')('server');

module.exports = function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  let message;
  let stack;

  if (err.status) {
    message = err.message;
  } else {
    message = "Unknown server error";
  }

  stack = err.stack;
  logger.error(stack);
  res.status(err.status || 500).json({ message });
}
