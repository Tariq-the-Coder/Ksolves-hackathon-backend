const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { content, sessionId, parentCommentId } = req.body;
  const newComment = new Comment({ content, sessionId, parentCommentId });
  await newComment.save();
  res.status(201).send('Comment created');
});

module.exports = router;
