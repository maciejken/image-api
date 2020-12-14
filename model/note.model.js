module.exports = function NoteModel(db, Sequelize) {
  const Note = db.define('note', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return Note;
};