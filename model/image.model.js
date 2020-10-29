module.exports = function ImageModel(db, Sequelize) {
  const Image = db.define('image', {
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
    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    datetime: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    camera: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    width: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    height: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    size: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });
  return Image;
};
