const express = require('express');
const router = express.Router();
const Unit = require('../models/Unit');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { name, classId } = req.body;
  const newUnit = new Unit({ name, classId });
  await newUnit.save();
  res.status(201).send('Unit created');
});

module.exports = router;
