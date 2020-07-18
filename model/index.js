var Sequelize = require('sequelize');
var UserModel = require('./user.model');
var logger = require('../libs/logger')('model');

var db = new Sequelize({
  dialect: process.env.SEQUELIZE_DIALECT,
  storage: process.env.SEQUELIZE_STORAGE,
  logging: process.env.SEQUELIZE_LOGGING
});

var User = UserModel(db, Sequelize);

db.sync().then(() => {
  logger.info(`database synced`);
});

module.exports = {
  User,
};
