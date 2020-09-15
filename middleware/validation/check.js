'use strict';

var { checkSchema, validationResult } = require('express-validator');
var CustomError = require('../errors/custom-error');

function checkValidationResult(req, res, next) {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    const message = result.errors
      .map(e => `Error: ${e.param} = '${e.value}' in ${e.location}, message: ${e.msg}`)
      .join(' ');
    next(new CustomError(message, 422));
  } else {
    next();
  }
}

module.exports = function check(...schemas) {
  return [ ...schemas.map(checkSchema), checkValidationResult ];
};
