const Sequelize = require('sequelize');
const logger = require('../libs/logger')('model');

const UserModel = require('./user.model');
const UserDetailModel = require('./user-detail.model');
const GroupModel = require('./group.model');
const GroupDetailModel = require('./group-detail.model');
const ImageModel = require('./image.model');
const ImageDetailModel = require('./image-detail.model');
const CvModel = require('./cv.model');
const CvDetailModel = require('./cv-detail.model');
const ExperienceModel = require('./experience.model');
const ExperienceDetailModel = require('./experience-detail.model');

const { Tables } = require('../enum');

const db = new Sequelize({
  dialect: process.env.SEQUELIZE_DIALECT,
  storage: process.env.SEQUELIZE_STORAGE,
  logging: process.env.SEQUELIZE_LOGGING
});

const User = UserModel(db, Sequelize);
const UserDetail = UserDetailModel(db, Sequelize);
const Group = GroupModel(db, Sequelize);
const GroupDetail = GroupDetailModel(db, Sequelize);
const Image = ImageModel(db, Sequelize);
const ImageDetail = ImageDetailModel(db, Sequelize);
const Cv = CvModel(db, Sequelize);
const CvDetail = CvDetailModel(db, Sequelize);
const Experience = ExperienceModel(db, Sequelize);
const ExperienceDetail = ExperienceDetailModel(db, Sequelize);

Image.hasMany(ImageDetail);
Cv.hasMany(CvDetail, { as: 'details' });
Cv.hasMany(Experience);
Experience.hasMany(ExperienceDetail, { as: 'details' });
User.hasMany(UserDetail, { as: 'details' });
User.hasMany(Image);
Cv.belongsTo(User);
Group.hasMany(Image);
Group.hasMany(GroupDetail, { as: 'details' });
User.belongsToMany(Group, { through: Tables.UserGroup });

db.sync().then(() => {
  logger.info(`database synced`);
});

module.exports = {
  Cv,
  CvDetail,
  Experience,
  ExperienceDetail,
  Group,
  GroupDetail,
  Image,
  ImageDetail,
  User,
  UserDetail,
};
