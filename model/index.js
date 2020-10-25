const Sequelize = require('sequelize');
const UserModel = require('./user.model');
const GroupModel = require('./group.model');
const ImageModel = require('./image.model');
const logger = require('../libs/logger')('model');

const db = new Sequelize({
  dialect: process.env.SEQUELIZE_DIALECT,
  storage: process.env.SEQUELIZE_STORAGE,
  logging: process.env.SEQUELIZE_LOGGING
});

const User = UserModel(db, Sequelize);
const Group = GroupModel(db, Sequelize);
const Image = ImageModel(db, Sequelize);

User.hasMany(Image);
Group.hasMany(Image);
User.belongsToMany(Group, { through: 'user_groups' });

db.sync().then(() => {
  logger.info(`database synced`);
});

module.exports = {
  Image,
  User,
  Group,
};
