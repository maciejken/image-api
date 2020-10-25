module.exports = function GroupModel(db, Sequelize) {
  const Group = db.define('group', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    totem: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return Group;
};