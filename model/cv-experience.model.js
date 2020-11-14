module.exports = function CvExperienceModel(db, Sequelize) {
  const CvExperience = db.define('cv_experience', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
  });

  return CvExperience;
};