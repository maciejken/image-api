const Sequelize = require('sequelize');
const UserModel = require('./user.model');
const GroupModel = require('./group.model');
const ImageModel = require('./image.model');
const CvDocumentModel = require('./cv-document.model');
const ExperienceModel = require('./experience.model');
const CvExperienceModel = require('./cv-experience.model');
const SkillModel = require('./skill.model');
const CvSkillModel = require('./cv-skill.model');
const SkillExperienceModel = require('./skill-experience.model');
const OrganizationModel = require('./organization.model');
const logger = require('../libs/logger')('model');

const db = new Sequelize({
  dialect: process.env.SEQUELIZE_DIALECT,
  storage: process.env.SEQUELIZE_STORAGE,
  logging: process.env.SEQUELIZE_LOGGING
});

const User = UserModel(db, Sequelize);
const Group = GroupModel(db, Sequelize);
const Image = ImageModel(db, Sequelize);
const CvDocument = CvDocumentModel(db, Sequelize);
const Experience = ExperienceModel(db, Sequelize);
const CvExperience = CvExperienceModel(db, Sequelize);
const Skill = SkillModel(db, Sequelize);
const CvSkill = CvSkillModel(db, Sequelize);
const SkillExperience = SkillExperienceModel(db, Sequelize);
const Organization = OrganizationModel(db, Sequelize);

User.hasMany(Image);
Group.hasMany(Image);
User.belongsToMany(Group, { through: 'user_groups' });
User.hasMany(CvDocument);
Experience.belongsToMany(CvDocument, { through: CvExperience });
Experience.belongsToMany(Skill, { through: SkillExperience });
Skill.belongsToMany(CvDocument, { through: CvSkill });
Organization.hasMany(Experience);

db.sync().then(() => {
  logger.info(`database synced`);
});

module.exports = {
  Image,
  User,
  Group,
  CvDocument,
  Skill,
  CvSkill,
  Organization,
  Experience,
  CvExperience,
  SkillExperience,
};
