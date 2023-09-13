const router = require('express').Router();
const sequelize = require('../config/connection');
const { Transaction, User } = require('../models');
const withAuth = require('../utils/auth');
const { Sequelize } = require('sequelize');



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


// router.get('/report', withAuth, async (req, res) => {
//   try {
//     // Find the logged in user based on the session ID
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Transaction }],
//       attributes: {
//         include: [
//           [
//             // Use plain SQL to add up the total grocery
//             sequelize.literal(
//               '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Groceries")'
//             ),
//             'totalGroceries',
//           ],
//           [
//             // Use plain SQL to add up the total rent
//             sequelize.literal(
//               '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Rent")'
//             ),
//             'totalrents',
//           ],
//           [
//             // Use plain SQL to add up the total Insurance
//             sequelize.literal(
//               '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Insurance")'
//             ),
//             'totalinsurance',
//           ],
//           [
//             // Use plain SQL to add up the total Entertainment
//             sequelize.literal(
//               '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Entertainment")'
//             ),
//             'totalentertainment',
//           ],
//           [
//             // Use plain SQL to add up the total Miscellaneous
//             sequelize.literal(
//               '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Miscellaneous")'
//             ),
//             'totalmiscellaneous',
//           ],
//           [
//             // Use plain SQL to add up the total Miscellaneous
//             sequelize.literal(
//               '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Work")'
//             ),
//             'totalWork',
//           ],
//           [
//             // Use plain SQL to add up the total Miscellaneous
//             sequelize.literal(
//               '(SELECT SUM(amount) FROM transaction WHERE transaction.category = "Trade")'
//             ),
//             'totalTrade',
//           ],
//           [
//             // Use plain SQL to add up the total Miscellaneous
//             sequelize.literal(
//               '(SELECT SUM(amount) FROM transaction WHERE transaction.type = "Income")'
//             ),
//             'totalIncome',
//           ],
//           [
//             // Use plain SQL to add up the total Miscellaneous
//             sequelize.literal(
//               '(SELECT SUM(amount) FROM transaction WHERE transaction.type = "Expense")'
//             ),
//             'totalExpense',
//           ],
//         ],
//       },
//     });

//     const user = userData.get({ plain: true });

//     res.render('report', {
//       ...user,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Define the GET router for report page
router.get('/report', withAuth, async (req, res) => {
  try {
    const userId = req.session.user_id;

    // const { satartData, endDate } = req.query; ???????

    const result = await Transaction.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN category = "Groceries" THEN amount ELSE 0 END')), 'totalGroceries'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN category = "Rent" THEN amount ELSE 0 END')), 'totalrents'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN category = "Insurance" THEN amount ELSE 0 END')), 'totalinsurance'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN category = "Entertainment" THEN amount ELSE 0 END')), 'totalentertainment'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN category = "Miscellaneous" THEN amount ELSE 0 END')), 'totalmiscellaneous'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN category = "Work" THEN amount ELSE 0 END')), 'totalWork'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN category = "Trade" THEN amount ELSE 0 END')), 'totalTrade'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN type = "Income" THEN amount ELSE 0 END')), 'totalIncome'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN type = "Expense" THEN amount ELSE 0 END')), 'totalExpense'],
      ],

      where: {
        userId: userId,
        [Sequelize.Op.or]: [
          { category: 'Groceries' },
          { category: 'Rent' },
          { category: 'Insurance' },
          { category: 'Entertainment' },
          { category: 'Miscellaneous' },
          { category: 'Work' },
          { category: 'Trade' },
          { type: 'Income' },
          { type: 'Expense' },
        ],
      },
    });

    const totalGroceries = result.length ? result[0].dataValues.totalGroceries : 0;
    const totalrents = result.length ? result[0].dataValues.totalrents : 0;
    const totalinsurance = result.length ? result[0].dataValues.totalinsurance : 0;
    const totalentertainment = result.length ? result[0].dataValues.totalentertainment : 0;
    const totalmiscellaneous = result.length ? result[0].dataValues.totalmiscellaneous : 0;
    const totalWork = result.length ? result[0].dataValues.totalWork : 0;
    const totalTrade = result.length ? result[0].dataValues.totalTrade : 0;
    const totalIncome = result.length ? result[0].dataValues.totalIncome : 0;
    const totalExpense = result.length ? result[0].dataValues.totalExpense : 0;

    console.log(`======================================\n=====================================`);
    console.log(totalExpense);
    console.log(typeof totalExpense);
    console.log(totalIncome);
    console.log(typeof totalIncome);
    var numExpense = parseInt(totalExpense);
    console.log(typeof numExpense);
    var numIncom = parseInt(totalIncome);
    console.log(typeof numIncom);
    var positiveNetIncome = numIncom > numExpense;
    console.log(positiveNetIncome);
    var negativeNetIncome = numIncom <= numExpense;
    console.log(negativeNetIncome);


    res.render('report', {
      totalGroceries,
      totalrents,
      totalinsurance,
      totalentertainment,
      totalmiscellaneous,
      totalWork,
      totalTrade,
      totalIncome,
      totalExpense,
      logged_in: true,
      positiveNetIncome,
      negativeNetIncome,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged-in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Transaction }],
    });
    const user = userData.get({ plain: true });
    const reversedTransactions = user.transactions.reverse();
    const first5ReversedTransactions = reversedTransactions.slice(0, 5);
    res.render('dashboard', {
      ...user,
      transactions: first5ReversedTransactions,
      logged_in: true,
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

// Define a route for the "history" page
router.get('/history', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Transaction }],
    });

    const user = userData.get({ plain: true });
    const reversedTransactions = user.transactions.reverse();


    res.render('history', {
      ...user,
      transactions: reversedTransactions,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;