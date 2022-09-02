const { DataTypes, Model } = require('sequelize');
const db = require('../db');

class Event extends Model { };

Event.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false
  },
  online: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  minPart: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  maxPart: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  feriado: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
}, {
  sequelize: db,
  tableName: 'events',
  modelName: 'Event'
});

module.exports = Event;
