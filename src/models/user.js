
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
    }
  }

  User.init({
    userID: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });

  return User;
};
