const { Tables } = require('../enum');

module.exports = function UserDetailModel(db, Sequelize) {
  const UserDetail = db.define(Tables.UserDetail, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userId: {
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
  }, {
    timestamps: false,
  });

  return UserDetail;
};
