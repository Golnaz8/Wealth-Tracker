const User = require('./User');
const Transaction = require('./Transaction');


User.hasMany(Transaction, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Transaction.belongsTo(User, {
    foreignKey: 'userId'
});

module.exports = {
    User,
    Transaction
};