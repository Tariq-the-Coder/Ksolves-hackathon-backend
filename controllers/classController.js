const Class = require('../models/Class');

const createClass = async (req, res) => {
  try {
    const { name, instructorId } = req.body;
    const newClass = new Class({ name, instructor: instructorId });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('instructor');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error });
  }
};

module.exports = { createClass, getClasses };
