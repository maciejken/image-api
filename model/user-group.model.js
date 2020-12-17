const { Tables } = require('../enum');

module.exports = function UserGroupModel(db, Sequelize) {
  const UserGroup = db.define(Tables.UserGroup, {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    groupId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  });

  return UserGroup;
};
