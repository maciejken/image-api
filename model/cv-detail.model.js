const { Tables } = require('../enum');

module.exports = function CvDetailModel(db, Sequelize) {
  const CvDetail = db.define(Tables.CvDetail, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    cvId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    link: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: false,
  });

  return CvDetail;
};
