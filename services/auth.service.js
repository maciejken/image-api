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
    return getSignedToken(user);        
  } else {
    throw new CustomError('incorrect username or password', 403);
  }
}

async function getSignedToken(user) {
  const userGroups = await user.getGroups();
  const groups = userGroups.map(group => group.id);
  const payload = {
    groups,
  };
  const options = {
    expiresIn: process.env.ID_TOKEN_VALIDITY_SECONDS * 1000,
    subject: String(user.id)
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

async function refreshToken(oldToken) {
  try {
    const verifiedToken = verifyToken(oldToken);
    const id = parseInt(verifiedToken.sub);
    const user = await User.findOne({ where: { id }});
    return getSignedToken(user);
  } catch (err) {
    throw new CustomError(err.message, 403);
  }
}

module.exports = {
  getTokenFromBasic,
  verifyToken,
  refreshToken,
};
