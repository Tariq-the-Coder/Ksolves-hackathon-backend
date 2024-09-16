const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have this

// Middleware to validate instructor ID
const validateInstructorId = (req, res, next) => {
  const { instructor } = req.body;
  if (!mongoose.Types.ObjectId.isValid(instructor)) {
    return res.status(400).send('Invalid instructor ID');
  }
  next();
};

// Route to create a class
router.post('/', authMiddleware, validateInstructorId, async (req, res) => {
  const { name, instructor } = req.body;

  // Check if user is an instructor
  if (req.user.role !== 'instructor') {
    return res.status(403).send('Only instructors can create classes');
  }

  try {
    // Create a new class
    const newClass = new Class({ name, instructor });
    
    // Save the class
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).send('An error occurred while creating the class');
    console.error('Error creating class:', error);
  }
});

// Route to get all classes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).send('An error occurred while fetching classes');
    console.error('Error fetching classes:', error);
  }
});

module.exports = router;
