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

const verify = (req, res, next, options) => {
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
    next();
  } else {
    throw notPermittedError;
  }
};

function verifyAdmin(req, res, next) {
  try {
    verify(req, res, next, { groupId: adminGroupId });
  } catch (err) {
    next(err);
  }
}

function verifyAddress(req, res, next) {
  try {
    verify(req, res, next, { address: req.ip });
  } catch (err) {
    next(err);
  }
}

function verifyGroup(req, res, next) {
  try {
    verify(req, res, next, {
      groupId: parseInt(req.params.groupId || req.params.id || adminGroupId),
    });
  } catch (err) {
    next(err);
  }
}

const verifyUser = (req, res, next) => {
  try {
    verify(req, res, next, {
      userId: parseInt(req.params.userId || req.params.id),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verify,
  verifyAdmin,
  verifyAddress,
  verifyGroup,
  verifyUser,
};
