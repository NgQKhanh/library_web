
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BookCopy extends Model {
    static associate(models) {
      BookCopy.belongsTo(models.Book, { foreignKey: 'id' });
    }
  }

  BookCopy.init({
    bookID: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'book',
        key: 'id'
      }
    },
    location: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'BookCopy',
    tableName: 'book_copy',
    timestamps: false
  });

  return BookCopy;
};
