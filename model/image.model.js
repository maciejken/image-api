const { Tables } = require('../enum');

module.exports = function ImageModel(db, Sequelize) {
  const Image = db.define(Tables.Image, {
    filename: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    groupId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    caption: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });
  return Image;
};
