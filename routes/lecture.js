const express = require('express');
const router = express.Router();
const Lecture = require('../models/Class');
const Session = require('../models/Class');

// POST - Create a lecture under a specific session
router.post('/sessions/:sessionId/lectures', async (req, res) => {
  const { title, content } = req.body;
  try {
    const lecture = new Lecture({
      title,
      content,
      sessionId: req.params.sessionId,
    });
    await lecture.save();

    // Add the lecture to the session
    const session = await Session.findById(req.params.sessionId);
    session.lectures.push(lecture._id);
    await session.save();

    res.status(201).json(lecture);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lecture' });
  }
});

// GET - Fetch lectures for a specific session
router.get('/sessions/:sessionId/lectures', async (req, res) => {
  try {
    const lectures = await Lecture.find({ sessionId: req.params.sessionId });
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lectures' });
  }
});

module.exports = router;
