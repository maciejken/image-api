const { Tables } = require('../enum');

module.exports = function ExperienceDetailModel(db, Sequelize) {
  const ExperienceDetail = db.define(Tables.ExperienceDetail, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    experienceId: {
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
    order: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });

  return ExperienceDetail;
};
