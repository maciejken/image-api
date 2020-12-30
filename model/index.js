const Sequelize = require('sequelize');
const logger = require('../libs/logger')('model');

const UserModel = require('./user.model');
const UserDetailModel = require('./user-detail.model');
const GroupModel = require('./group.model');
const GroupDetailModel = require('./group-detail.model');
const UserGroupModel = require('./user-group.model');
const ImageModel = require('./image.model');
const ImageDetailModel = require('./image-detail.model');
const CvModel = require('./cv.model');
const CvDetailModel = require('./cv-detail.model');
const ExperienceModel = require('./experience.model');
const ExperienceDetailModel = require('./experience-detail.model');

const db = new Sequelize({
  // shouldn't move these opts to config to avoid circular dependency
  username: process.env.SEQUELIZE_USERNAME,
  password: process.env.SEQUELIZE_PASSWORD,
  host: process.env.SEQUELIZE_HOST,
  port: process.env.SEQUELIZE_PORT,
  dialect: process.env.SEQUELIZE_DIALECT,
  storage: process.env.SEQUELIZE_STORAGE,
  database: process.env.SEQUELIZE_DATABASE,
  logging: process.env.SEQUELIZE_LOGGING,
});

const User = UserModel(db, Sequelize);
const UserDetail = UserDetailModel(db, Sequelize);
const Group = GroupModel(db, Sequelize);
const GroupDetail = GroupDetailModel(db, Sequelize);
const UserGroup = UserGroupModel(db, Sequelize);
const Image = ImageModel(db, Sequelize);
const ImageDetail = ImageDetailModel(db, Sequelize);
const Cv = CvModel(db, Sequelize);
const CvDetail = CvDetailModel(db, Sequelize);
const Experience = ExperienceModel(db, Sequelize);
const ExperienceDetail = ExperienceDetailModel(db, Sequelize);

Image.hasMany(ImageDetail, { as: 'details', foreignKey: 'filename' });
Cv.hasMany(CvDetail, { as: 'details' });
Cv.hasMany(Experience);
Experience.hasMany(ExperienceDetail, { as: 'details' });
User.hasMany(UserDetail, { as: 'details' });
User.hasMany(Image);
Image.belongsTo(User);
Group.hasMany(Image);
Image.belongsTo(Group);
User.hasMany(Cv);
Cv.belongsTo(User);
Group.hasMany(GroupDetail, { as: 'details' });
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

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
  UserGroup,
};
