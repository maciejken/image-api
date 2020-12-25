const authService = require('../services/auth.service');
const CustomError = require('./errors/custom-error');
const requestUtil = require('../utils/request.util');
const { Regex } = require('../enum');

const notPermittedError = new CustomError(`unable to perform requested operation`, 403);
const { adminGroupId } = require('../config');

function processToken(req, res) {
  if (!res.locals.userId) {
    const token = requestUtil.getAccessToken(req);
    const verifiedToken = authService.verifyToken(token);
    const { groups, sub } = verifiedToken;
    res.locals.userId = parseInt(sub);
    res.locals.groups = groups;
  }
}

function verify(req, res, options) {
  let canAuthorize;
  if (!options) {
    processToken(req, res);
    canAuthorize = true;
  } else if (options.address) {
    canAuthorize = new RegExp(Regex.localAddress).test(options.address);
  } else {
    processToken(req, res);
    const { groups, userId } = res.locals;
    if (options.userId) {
      canAuthorize = userId === options.userId || groups && groups.includes(adminGroupId);
    } else if (options.groupId) {
      canAuthorize = groups && (groups.includes(options.groupId) || groups.includes(adminGroupId));
    }
  }

  if (canAuthorize) {
    return true;
  } else {
    throw notPermittedError;
  }
};

function verifyAdmin(req, res, next) {
  try {
    verify(req, res, { groupId: adminGroupId });
    next();
  } catch (err) {
    next(err);
  }
}

function verifyAddress(req, res, next) {
  try {
    verify(req, res, { address: req.ip });
    next();
  } catch (err) {
    next(err);
  }
}

function verifyGroup(req, res, next) {
  try {
    verify(req, res, {
      groupId: parseInt(req.params.groupId || req.params.id || adminGroupId),
    });
    next();
  } catch (err) {
    next(err);
  }
}

function verifyUser(req, res, next) {
  try {
    verify(req, res, {
      userId: parseInt(req.params.userId || req.params.id),
    });
    next();
  } catch (err) {
    next(err);
  }
};

function verifyToken(req, res, next) {
  try {
    verify(req, res);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyAddress,
  verifyGroup,
  verifyUser,
};
