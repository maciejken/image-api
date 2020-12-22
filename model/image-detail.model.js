const { Tables } = require('../enum');

module.exports = function ImageDetailModel(db, Sequelize) {
  const ImageDetail = db.define(Tables.ImageDetail, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: false,
  });

  return ImageDetail;
};
