module.exports = function CvDocumentModel(db, Sequelize) {
  const Cv = db.define('cv', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
  });

  return Cv;
};