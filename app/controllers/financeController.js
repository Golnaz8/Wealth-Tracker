const { Finance } = require('../models');

const financeController = {
  getAllFinances: async (req, res) => {
    try {
      const finances = await Finance.findAll();
      res.json(finances);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createFinance: async (req, res) => {
    try {
      const { title, amount, category } = req.body;
      const newFinance = await Finance.create({ title, amount, category });
      res.status(201).json(newFinance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = financeController;
