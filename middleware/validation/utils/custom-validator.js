'use strict';

const authService = require('../../../services/auth.service');
const userService = require('../../../services/user.service');
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
  isBasicAuth(value, { res }) {
    if (!/^Basic [A-Za-z0-9=/+]{10,100}$/.test(value)) {
      res.set('WWW-Authenticate', 'Basic');
      throw new StatusCodeError(`unauthorized`, 401);
    }
    return true;
  },  
  isBearerAuth(value, { res }) {
    if (!/^Bearer \S{10,1000}$/.test(value)) {
      res.set('WWW-Authenticate', 'Bearer');
      throw new StatusCodeError(`unauthorized`, 401);
    }
    return true;
  },
  async isValidToken(auth) {
    const [authType, token] = auth.split(' ');
    const verifiedToken = authService.verifyIdToken(token);
    const user = await userService.getUser(verifiedToken.sub);
    if (!user) {
      throw new StatusCodeError(`user ${verifiedToken.sub} not found`, 400);
    }
    return verifiedToken;
  }
};
