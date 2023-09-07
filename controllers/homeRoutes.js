const router = require('express').Router();
const { Transaction, User } = require('../models');
const withAuth = require('../utils/auth');



router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
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


// Create a new route for updating a post
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
    res.render('financedetails',{
      transaction, 
      logged_in: true, 
      id: req.body.id,
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
  