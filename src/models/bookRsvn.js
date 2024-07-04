
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookReservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookReservation.belongsTo(models.User, { foreignKey: 'userID' });
      BookReservation.belongsTo(models.Book, { foreignKey: 'bookID' });
    }
  }
  BookReservation.init({
    userID: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reserved_at: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
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
