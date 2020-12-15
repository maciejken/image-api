const { Tables } = require('../enum');

module.exports = function CvDocumentModel(db, Sequelize) {
  const Cv = db.define(Tables.Cv, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
  });

  return Cv;
};