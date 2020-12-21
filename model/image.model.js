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
      type: Sequelize.STRING,
      allowNull: true,
    },
    // width: {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // },
    // height: {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // },
    // size: {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // },
    // datetime: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    // location: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    // camera: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
  });
  return Image;
};
