const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      // define association here if needed
    }
  }

  Book.init({
    id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    bookName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    author: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    publisher: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'book',
    timestamps: false
  });

  return Book;
};
