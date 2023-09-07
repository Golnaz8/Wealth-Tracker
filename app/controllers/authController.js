const User = require('../models/User');
const bcrypt = require('bcrypt');

const authController = {
  register: async (req, res) => {
    try {
      // Extract user registration data from the request body
      const { username, email, password } = req.body;

      // Validate user input
      // Check if the user already exists in the database
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash and salt the user's password
      const saltRounds = 10; // Number of salt rounds 

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user in the database with the hashed password
      const newUser = await User.create({ username, email, password: hashedPassword });

      // Set up a session for the new user
      req.session.userId = newUser.id;

      // Respond with a success message or redirect to a profile page
      res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    try {
      // Extract user login data from the request body
      const { email, password } = req.body;

      // Verify user credentials
      const user = await User.findOne({ where: { email } });

      if (!user || !user.comparePassword(password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Set up a session for the authenticated user
      req.session.userId = user.id;

      // Respond with a success message or redirect to a dashboard page
      res.json({ success: true, message: 'Login successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  logout: async (req, res) => {
    try {
      // Clear the user's session
      req.session.destroy();

      // Redirect to the login page or respond with a success message
      res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  resetPassword: async (req, res) => {
    try {
      // Extract user input
      const { email } = req.body;

      // Check if the user exists
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate a password reset token
      const resetToken = generateResetToken();

      // Send an email with the resetToken to the user's email address
      sendResetEmail(email, resetToken);

      // Respond with a success message or instruct the user to check their email
      res.json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = authController;
