
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ReadingRoom extends Model {
    static associate(models) {
      // define association here if needed
    }
  }

  ReadingRoom.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    room: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    location: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    topic: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    numUsers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    roomType: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ReadingRoom',
    tableName: 'reading_room',
    timestamps: false
  });

  return ReadingRoom;
};
