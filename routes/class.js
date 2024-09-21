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
// Route to get class details (only for enrolled students or the instructor)
router.get('/:id', authMiddleware, async (req, res) => {
  const classId = req.params.id;
  const userId = req.user._id; // User's ID from the auth middleware
  const userRole = req.user.role; // User's role (student or instructor)

  try {
    // Find the class by ID
    const classData = await Class.findById(classId).populate('instructor').populate('students');
    if (!classData) {
      return res.status(404).send('Class not found');
    }

    // Check if the user is the instructor of the class
    const isInstructor = classData.instructor._id.equals(userId); // Compare ObjectId

    // Check if the user is enrolled in the class (convert both IDs to strings for comparison)
    const isEnrolled = classData.students.some(studentId => studentId._id.equals(userId)); // Ensure _id comparison

    // Allow access if the user is an instructor or if the user is enrolled as a student
    if (userRole === 'instructor' && isInstructor) {
      // Instructors can access their own class details
      return res.status(200).json(classData);
    } else if (userRole === 'student' && isEnrolled) {
      // Students can access the class only if they are enrolled
      return res.status(200).json(classData);
    } else {
      // If neither enrolled student nor the instructor, deny access
      return res.status(403).send('You are not enrolled in this class');
    }
  } catch (error) {
    res.status(500).send('Error fetching class details');
    console.error('Error:', error);
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

// add unit
router.post('/:id/units', authMiddleware, async (req, res) => {
  const { id } = req.params; // Class ID
  const { title } = req.body; // Unit title

  if (req.user.role !== 'instructor') {
    return res.status(403).send('Only instructors can add units');
  }

  try {
    const cls = await Class.findById(id);
    if (!cls) return res.status(404).send('Class not found');

    // Add the unit to the class
    cls.units.push({ title });
    await cls.save();

    res.status(200).json(cls.units);
  } catch (error) {
    res.status(500).send('Error adding unit');
  }
});

// add session 
router.post('/:id/units/:unitId/sessions', authMiddleware, async (req, res) => {
  const { id, unitId } = req.params; // Class ID and Unit ID
  const { title } = req.body; // Session title

  if (req.user.role !== 'instructor') {
    return res.status(403).send('Only instructors can add sessions');
  }

  try {
    const cls = await Class.findById(id);
    if (!cls) return res.status(404).send('Class not found');

    const unit = cls.units.id(unitId);
    if (!unit) return res.status(404).send('Unit not found');

    // Add the session to the unit
    unit.sessions.push({ title });
    await cls.save();

    res.status(200).json(unit.sessions);
  } catch (error) {
    res.status(500).send('Error adding session');
  }
});

// Get class details with units and sessions
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).populate('students');
    if (!cls) return res.status(404).send('Class not found');

    res.status(200).json(cls);
  } catch (error) {
    res.status(500).send('Error fetching class details');
  }
});


module.exports = router;
