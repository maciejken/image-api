const Sequelize = require('sequelize');
const logger = require('../libs/logger')('model');

const UserModel = require('./user.model');
const GroupModel = require('./group.model');
const ImageModel = require('./image.model');
const CvModel = require('./cv.model');
const ExperienceModel = require('./experience.model');
const SkillModel = require('./skill.model');
const OrganizationModel = require('./organization.model');
const NoteModel = require('./note.model');
const { Tables } = require('../enum');

const db = new Sequelize({
  dialect: process.env.SEQUELIZE_DIALECT,
  storage: process.env.SEQUELIZE_STORAGE,
  logging: process.env.SEQUELIZE_LOGGING
});

const User = UserModel(db, Sequelize);
const Group = GroupModel(db, Sequelize);
const Image = ImageModel(db, Sequelize);
const Cv = CvModel(db, Sequelize);
const Experience = ExperienceModel(db, Sequelize);
const Skill = SkillModel(db, Sequelize);
const Organization = OrganizationModel(db, Sequelize);
const Note = NoteModel(db, Sequelize);

User.hasMany(Image);
Group.hasMany(Image);
User.belongsToMany(Group, { through: Tables.UserGroup });
Cv.belongsTo(User);
Cv.belongsToMany(Experience, { through: Tables.CvExperience });
Cv.belongsToMany(Skill, { through: Tables.CvSkill });
Cv.belongsToMany(Note, { through: Tables.CvNote });
Experience.belongsToMany(Skill, { through: Tables.SkillExperience });
Organization.hasMany(Experience);

db.sync().then(() => {
  logger.info(`database synced`);
});

module.exports = {
  Image,
  User,
  Group,
  Cv,
  Skill,
  Organization,
  Experience,
  Note,
};
