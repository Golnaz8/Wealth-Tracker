const router = require('express').Router();
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');

router.use('/users', authRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;
