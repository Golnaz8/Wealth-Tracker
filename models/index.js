const User = require('./User');
const Transaction = require('./Transaction'); 
const Budget = require('./Budget');
const BudgetTransaction = require('./BudgetTransaction');
const Report = require('./Report');

// Define associations between models
User.hasMany(Transaction, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

User.hasMany(Budget, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

User.hasMany(Report, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Transaction.belongsTo(User, {
  foreignKey: 'userId',
});

Budget.belongsTo(User, {
  foreignKey: 'userId',
});

Report.belongsTo(User, {
  foreignKey: 'userId',
});

Budget.belongsToMany(Transaction, {
  through: BudgetTransaction,
  foreignKey: 'budgetId',
});

Transaction.belongsToMany(Budget, {
  through: BudgetTransaction,
  foreignKey: 'transactionId',
});

module.exports = { User, Transaction, Budget, BudgetTransaction, Report };
