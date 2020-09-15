'use strict';
const { Regex } = require('../../../enum');

module.exports = {
  isPositiveInt(value) {
    if (value && !new RegExp(Regex.positiveInt).test(value)) {
      throw new Error('Value should be positive integer');
    }
    return true;
  },
  isArray(value) {
    if (value && !Array.isArray(value)) {
      throw new Error('Value should be an array');
    }
    return true;
  },
  isOrder(value) {
    if (value && !new RegExp(Regex.order, "i").test(value)) {
      throw new Error('Invalid value');
    }
    return true;
  },
};
