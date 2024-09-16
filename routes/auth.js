const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword, role });
    
    // Save the user
    await newUser.save();
    res.status(201).send('User created');
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).send('Username already exists');
    } else {
      // Other errors
      res.status(500).send('An error occurred while creating the user');
    }
    console.error('Error creating user:', error);
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // Find the user
    const user = await User.findOne({ username });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send('Invalid credentials');
    }

    // Check if the user is an instructor
    const instructorId = user.role === 'instructor' ? user._id : null;

    // Generate a JWT token, including instructorId in the payload
    const token = jwt.sign(
      { id: user._id, role: user.role, instructorId }, 
      'secret', 
      { expiresIn: '1h' }
    );

    // Send the token as response
    res.json({ token });
  } catch (error) {
    res.status(500).send('An error occurred while logging in');
    console.error('Error logging in:', error);
  }
});


// Find user by username
router.get('/findByUsername', async (req, res) => {
  const { username } = req.query;

  // Validate input
  if (!username) {
    return res.status(400).send('Username is required');
  }

  try {
    // Find the user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send the user ID as response
    res.json({ _id: user._id });
  } catch (error) {
    res.status(500).send('An error occurred while finding the user');
    console.error('Error finding user:', error);
  }
});

module.exports = router;
