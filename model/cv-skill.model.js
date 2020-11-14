module.exports = function CvSkillModel(db, Sequelize) {
  const CvSkill = db.define('cv_skill', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
  });

  return CvSkill;
};