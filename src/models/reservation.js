
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.User, { foreignKey: 'userID' });
      Reservation.belongsTo(models.ReadingRoom, { foreignKey: 'room', targetKey: 'room' });
    }
  }

  Reservation.init({
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
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    shift: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    seat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    room: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'reading_room',
        key: 'room'
      }
    }
  }, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservation',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['date', 'shift', 'seat']
      }
    ]
  });

  return Reservation;
};
