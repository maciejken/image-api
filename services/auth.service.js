const fs = require('fs');
const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync(`${process.env.CERT_DIR}/privkey.pem`);
const { User } = require('../model');
const CustomError = require('../middleware/errors/custom-error');

module.exports = {
  async getIdToken(auth) {
    if (auth) {
      const [email, password] = Buffer.from(auth, 'base64')
        .toString('ascii')
        .split(':');
      const user = await User.findOne({ where: { email } });
      if (user && user.isCorrectPassword(password)) {
        const payload = {
          admin: user.id === +process.env.ADMIN_ID
        };
        const options = {
          expiresIn: process.env.ID_TOKEN_EXPIRES_IN,
          subject: '' + user.id
        };
        return jwt.sign(payload, privateKey, options);        
      } else {
        throw new CustomError('incorrect username or password', 403);
      }
    } else {
      throw new CustomError(`unauthorized`, 401, ['WWW-Authenticate', 'Basic']);
    }
  },
  verifyToken(token) {
    if (token) {
      try {
        return jwt.verify(token, privateKey);      
      } catch (err) {
        throw new CustomError(err.message, 403);
      }
    } else {
      throw new CustomError(`unauthorized`, 401, ['WWW-Authenticate', 'Bearer']);
    }
  }
};
