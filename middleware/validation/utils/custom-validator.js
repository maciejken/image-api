'use strict';

var { Regex } = require('../../../enum');

function maybePositiveInt(value) {
  if (value && !new RegExp(Regex.positiveInt).test(value)) {
    throw new Error('Value should be positive integer');
  }
  return true;
}

function maybeArray(value) {
  if (value && !Array.isArray(value)) {
    throw new Error('Value should be an array');
  }
  return true;
}

function maybeOrder(value) {
  if (value && !new RegExp(Regex.order, "i").test(value)) {
    throw new Error('Invalid value');
  }
  return true;
}

module.exports = {
  maybeOrder,
  maybePositiveInt,
  maybeArray
};
