const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/authMiddleware');

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

// routes/classes.js
// Assuming students are part of Class schema in the backend
router.get('/', authMiddleware, async (req, res) => {
  try {
    const classes = await Class.find().populate('students');

    // Add `isEnrolled` flag for the logged-in user
    const result = classes.map(cls => ({
      ...cls.toObject(),
      isEnrolled: cls.students.some(studentId => studentId.equals(req.user._id)),  // Check if user is enrolled
    }));
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send('An error occurred while fetching classes');
    console.error('Error fetching classes:', error);
  }
});

// Route to delete a class
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  // Check if user is an instructor
  if (req.user.role !== 'instructor') {
    return res.status(403).send('Only instructors can delete classes');
  }

  try {
    const deletedClass = await Class.findByIdAndDelete(id);
    
    if (!deletedClass) {
      return res.status(404).send('Class not found');
    }

    res.status(200).json(deletedClass);
  } catch (error) {
    res.status(500).send('An error occurred while deleting the class');
    console.error('Error deleting class:', error);
  }
});


// routes/classes.js
router.post('/:id/enroll', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const cls = await Class.findById(id);
    if (!cls) return res.status(404).send('Class not found');
    
    // Check if user is already enrolled
    if (cls.students.includes(req.user._id)) {
      return res.status(400).send('Already enrolled in this class');
    }
    
    // Enroll the student
    cls.students.push(req.user._id);
    await cls.save();
    res.status(200).json(cls);
  } catch (error) {
    res.status(500).send('An error occurred while enrolling');
    console.error('Error enrolling in class:', error);
  }
});

// Route to open a class
// Route to get class details (only for enrolled students)
router.get('/:id', authMiddleware, async (req, res) => {
  const classId = req.params.id;
  const userId = req.user._id; // User's ID from the auth middleware

  try {
    // Find the class by ID
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).send('Class not found');
    }

    // Check if the user is enrolled in the class
    const isEnrolled = classData.students.includes(userId);
    if (!isEnrolled) {
      return res.status(403).send('You are not enrolled in this class');
    }

    // If enrolled, return the class details
    res.status(200).json(classData);
  } catch (error) {
    res.status(500).send('Error fetching class details');
    console.error('Error:', error);
  }
});

module.exports = router;
