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
    caption: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    capturedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
  return Image;
};
