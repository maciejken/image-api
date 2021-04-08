const CustomError = require('./errors/custom-error');
const { localNetworkIp } = require('../config');

const notPermittedError = new CustomError(`unable to perform requested operation`, 403);
const { adminGroupId } = require('../config');

// function verify(req, res, options) {
//   let canAuthorize;
//   if (!options) {
//     canAuthorize = true;
//   } else if (options.address) {
//     canAuthorize = localNetworkIp && options.address.includes(localNetworkIp);
//   } else {
//     processToken(req, res);
//     const { groups, userId } = res.locals;
//     if (options.userId) {
//       canAuthorize = options.userId === userId;
//     } else if (options.groupId) {
//       canAuthorize = groups && (groups.includes(options.groupId) || groups.includes(adminGroupId));
//       res.locals.groupId = (canAuthorize && options.groupId) || null;
//     }
//   }

//   if (canAuthorize) {
//     return true;
//   } else {
//     throw notPermittedError;
//   }
// };

function verifyAdmin(req, res, next) {
  try {
    // verify(req, res, { groupId: adminGroupId });
    next();
  } catch (err) {
    next(err);
  }
}

function verifyAddress(req, res, next) {
  try {
    // verify(req, res, { address: req.ip });
    next();
  } catch (err) {
    next(err);
  }
}

function verifyGroup(req, res, next) {
  try {
    // verify(req, res, {
    //   groupId: parseInt(req.params.groupId || req.params.id || adminGroupId),
    // });
    next();
  } catch (err) {
    next(err);
  }
}

function verifyUser(req, res, next) {
  try {
    // verify(req, res, {
    //   userId: parseInt(req.params.userId || req.params.id),
    // });
    next();
  } catch (err) {
    next(err);
  }
};

function verifyToken(req, res, next) {
  try {
    // verify(req, res);
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
