const { Tables } = require('../enum');

module.exports = function ImageDetailModel(db, Sequelize) {
  const ImageDetail = db.define(Tables.ImageDetail, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    imageId: {
      type: Sequelize.INTEGER,
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
    type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });

  return ImageDetail;
};
