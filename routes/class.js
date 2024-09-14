const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { name, instructor } = req.body;
  const newClass = new Class({ name, instructor });
  await newClass.save();
  res.status(201).send('Class created');
});

module.exports = router;
