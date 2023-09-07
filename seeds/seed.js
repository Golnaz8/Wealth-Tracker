const sequelize = require('../config/connection');
const { User, Transaction, Budget, BudgetTransaction, Report } = require('../models');

const userData = require('./userData.json');
const transactionData = require('./transactionData.json');
const budgetData = require('./budgetData.json');
const budgetTransactionData = require('./budgetTransactionData.json');
const reportData = require('./reportData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // Create users
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  // Create transactions with assigned users
  for (const transaction of transactionData) {
    const assignedUser = users.find((user) => user.name === transaction.user_name);

    if (assignedUser) {
      await Transaction.create({
        ...transaction,
        userId: assignedUser.id,
      });
    }
  }

  // Create budgets with assigned users
  for (const budget of budgetData) {
    const assignedUser = users.find((user) => user.name === budget.user_name);

    if (assignedUser) {
      await Budget.create({
        ...budget,
        userId: assignedUser.id,
      });
    }
  }

  // Create budget transactions with assigned budgets and transactions
  for (const budgetTransaction of budgetTransactionData) {
    const assignedBudget = budgetData.find((budget) => budget.budgetName === budgetTransaction.budget_name);
    const assignedTransaction = transactionData.find((transaction) => transaction.description === budgetTransaction.transaction_description);

    if (assignedBudget && assignedTransaction) {
      await BudgetTransaction.create({
        budgetId: assignedBudget.id,
        transactionId: assignedTransaction.id,
      });
    }
  }

  // Create reports with assigned users
  for (const report of reportData) {
    const assignedUser = users.find((user) => user.name === report.user_name);

    if (assignedUser) {
      await Report.create({
        ...report,
        userId: assignedUser.id,
      });
    }
  }

  process.exit(0);
};

seedDatabase();
