const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class BudgetTransaction extends Model {}

BudgetTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    budgetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'budget',
        key: 'id',
      },
    },
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'transaction', 
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'budget_transaction',
  }
);

module.exports = BudgetTransaction;
