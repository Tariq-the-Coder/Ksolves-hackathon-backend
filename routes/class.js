// backend/routes/class.js
const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const mongoose = require('mongoose');

// Middleware to validate instructor ID
const validateInstructorId = (req, res, next) => {
  const { instructor } = req.body;
  if (!mongoose.Types.ObjectId.isValid(instructor)) {
    return res.status(400).send('Invalid instructor ID');
  }
  next();
};

router.post('/', validateInstructorId, async (req, res) => {
  const { name, instructor } = req.body;

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

module.exports = router;
