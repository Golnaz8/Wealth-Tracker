const router = require('express').Router();
const sequelize = require('../config/connection');
const { Transaction, User } = require('../models');
const withAuth = require('../utils/auth');



router.get('/', async (req, res) => {
  try {
    // Get all transactions and JOIN with user data
    const trData = await Transaction.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const trs = trData.map((tr) => tr.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      trs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// Create a new route for updating a transaction
router.get('/update/:id', withAuth, async (req, res) => {
  try {
    const trData = await Transaction.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    if (!trData) {
      res.redirect("/dashboard");
    }
    const transaction = trData.get({ plain: true });

    // Send the transaction data as JSON to the client
    res.render('financedetails', {
      transaction,
      logged_in: true,
      id: req.body.id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/report', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Transaction }],
      attributes: {
        include: [
          [
            // Use plain SQL to add up the total grocery
            sequelize.literal(
              '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Groceries")'
            ),
            'totalGroceries',
          ],
          [
            // Use plain SQL to add up the total rent
            sequelize.literal(
              '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Rent")'
            ),
            'totalrents',
          ],
          [
            // Use plain SQL to add up the total Insurance
            sequelize.literal(
              '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Insurance")'
            ),
            'totalinsurance',
          ],
          [
            // Use plain SQL to add up the total Entertainment
            sequelize.literal(
              '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Entertainment")'
            ),
            'totalentertainment',
          ],
          [
            // Use plain SQL to add up the total Miscellaneous
            sequelize.literal(
              '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Miscellaneous")'
            ),
            'totalmiscellaneous',
          ],
          [
            // Use plain SQL to add up the total Miscellaneous
            sequelize.literal(
              '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Work")'
            ),
            'totalWork',
          ],
          [
            // Use plain SQL to add up the total Miscellaneous
            sequelize.literal(
              '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Trade")'
            ),
            'totalTrade',
          ],
          [
            // Use plain SQL to add up the total Miscellaneous
            sequelize.literal(
              '(SELECT SUM(amount) FROM transaction WHERE transaction.type = "Income")'
            ),
            'totalIncome',
          ],
          [
            // Use plain SQL to add up the total Miscellaneous
            sequelize.literal(
              '(SELECT SUM(amount) FROM transaction WHERE transaction.type = "Expense")'
            ),
            'totalExpense',
          ],
        ],
      },
    });

    const user = userData.get({ plain: true });

    res.render('report', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Transaction }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;
