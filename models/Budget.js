const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Budget extends Model {}

Budget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    budgetName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budgetAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: { // We need to check out the categories
      type: DataTypes.STRING,
      allowNull: false,
    },
    timePeriod: {
      type: DataTypes.ENUM('Monthly', 'Yearly'), 
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true, // Allow null for monthly budgets
    },
    alertsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Enable alerts by default. We can remove this if we want to. Will have no impact
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'budget',
  }
);

module.exports = Budget;
