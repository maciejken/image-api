var fs = require('fs');
var jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync(`${process.env.CERT_DIR}/privkey.pem`);
var { User } = require('../model');

module.exports = {
  getIdToken(email, password) {
    return User.findOne({ where: { email } })
    .then(user => { 
      let token = null;
      if (user && user.isCorrectPassword(password)) {
        var payload = {
          admin: user.role === 'admin'
        };
        var options = {
          expiresIn: process.env.ID_TOKEN_EXPIRES_IN,
          subject: '' + user.id
        };
        token = jwt.sign(payload, privateKey, options);
      }
      return token;
    });
  },
  verifyIdToken(token) {
    return jwt.verify(token, privateKey);
  },
};
