const crypto = require('crypto');

module.exports = function UserModel(db, Sequelize) {
  const User = db.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    occupation: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    github: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    linkedin: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    twitter: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    photo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      get() {
        return () => this.getDataValue('password');
      }
    },
    salt: {
      type: Sequelize.STRING,
      get() {
        return () => this.getDataValue('salt');
      }
    }
  });

  User.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
  };

  User.encryptPassword = function (plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex');
  };

  const setSaltAndPassword = user => {
    if (user.changed('password')) {
      user.salt = User.generateSalt();
      user.password = User.encryptPassword(user.password(), user.salt());
    }
  };

  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);

  User.prototype.isCorrectPassword = function (enteredPassword) {
    return User.encryptPassword(enteredPassword, this.salt()) === this.password();
  };

  return User;
};