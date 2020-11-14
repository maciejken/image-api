module.exports = function SkillExperienceModel(db, Sequelize) {
  const SkillExperience = db.define('skill_experience', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
  });

  return SkillExperience;
};