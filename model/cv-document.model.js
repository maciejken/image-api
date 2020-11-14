module.exports = function CvDocumentModel(db, Sequelize) {
  const CvDocument = db.define('cv_document', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    objective: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    footer: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  });

  return CvDocument;
};