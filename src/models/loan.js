
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Loan extends Model {
    static associate(models) {
      Loan.belongsTo(models.User, { foreignKey: 'userID' });
      Loan.belongsTo(models.BookCopy, { foreignKey: 'bookID' });
    }
  }

  Loan.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    userID: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'users',
        key: 'userID'
      }
    },
    bookID: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'book_copy',
        key: 'bookID'
      }
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Loan',
    tableName: 'loan',
    timestamps: false
  });

  return Loan;
};
