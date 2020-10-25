const fs = require('fs');
const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync(`${process.env.CERT_DIR}/privkey.pem`);
const { User } = require('../model');
const CustomError = require('../middleware/errors/custom-error');

async function getTokenFromBasic(auth) {
  const [email, password] = Buffer.from(auth, 'base64')
    .toString('ascii')
    .split(':');
  const user = await User.findOne({ where: { email } });
  if (user && user.isCorrectPassword(password)) {
    const groups = await user.getGroups();
    const gids = groups.map(g => g.id);
    return getSignedToken(user.id, gids);        
  } else {
    throw new CustomError('incorrect username or password', 403);
  }
}

function getSignedToken(userId, groups) {
  const payload = {
    groups,
  };
  const options = {
    expiresIn: process.env.ID_TOKEN_VALIDITY_SECONDS * 1000,
    subject: String(userId)
  };
  return jwt.sign(payload, privateKey, options);
}

function verifyToken(token) {
  try {
    return jwt.verify(token, privateKey);      
  } catch (err) {
    throw new CustomError(err.message, 403);
  }
}

function refreshToken(oldToken) {
  try {
    const verifiedToken = verifyToken(oldToken);
    const userId = parseInt(verifiedToken.sub);
    const groups = verifiedToken.groups;
    return getSignedToken(userId, groups);
  } catch (err) {
    throw new CustomError(err.message, 403);
  }
}

module.exports = {
  getTokenFromBasic,
  verifyToken,
  refreshToken,
};
