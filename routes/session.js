const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { title, unitId, lectures } = req.body;
  const newSession = new Session({ title, unitId, lectures });
  await newSession.save();
  res.status(201).send('Session created');
});

module.exports = router;
