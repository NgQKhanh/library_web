
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BookReservation extends Model {
    static associate(models) {
      BookReservation.belongsTo(models.User, { foreignKey: 'userID' });
      BookReservation.belongsTo(models.Book, { foreignKey: 'bookID' });
    }
  }
  BookReservation.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userID: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reserved_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
    bookID: {
      type: DataTypes.STRING(20),
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'BookReservation',
    tableName: 'book_reservation',
    timestamps: false,
  });
  return BookReservation;
};
