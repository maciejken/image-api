module.exports = function ImageModel(db, Sequelize) {
  var Image = db.define('image', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    userId: { // authorId?
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    caption: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  });
  return Image;
};
