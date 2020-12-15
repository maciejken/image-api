const Sequelize = require('sequelize');
const logger = require('../libs/logger')('model');

const UserModel = require('./user.model');
const GroupModel = require('./group.model');
const ImageModel = require('./image.model');
const CvModel = require('./cv.model');
const ExperienceModel = require('./experience.model');
const DetailModel = require('./detail.model');

const { Tables } = require('../enum');

const db = new Sequelize({
  dialect: process.env.SEQUELIZE_DIALECT,
  storage: process.env.SEQUELIZE_STORAGE,
  logging: process.env.SEQUELIZE_LOGGING
});

const User = UserModel(db, Sequelize);
const Detail = DetailModel(db, Sequelize);
const Group = GroupModel(db, Sequelize);
const Image = ImageModel(db, Sequelize);
const Cv = CvModel(db, Sequelize);
const Experience = ExperienceModel(db, Sequelize);

User.hasMany(Image);
User.hasMany(Detail);
User.hasMany(Cv);
Group.hasMany(Image);
Group.hasMany(Detail);
User.belongsToMany(Group, { through: Tables.UserGroup });
Cv.hasMany(Detail);
Cv.hasMany(Experience);
Experience.hasMany(Detail);

db.sync().then(() => {
  logger.info(`database synced`);
});

module.exports = {
  Cv,
  Detail,
  Experience,
  Group,
  Image,
  User,
};
