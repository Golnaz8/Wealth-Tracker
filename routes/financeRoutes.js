const express = require('express');
const financeController = require('../controllers/financeController');

const router = express.Router();

// Define finance routes
router.get('/finances', financeController.getAllFinances);
router.post('/finances', financeController.createFinance);

module.exports = router;
