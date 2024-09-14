const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: { type: String, required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
});

module.exports = mongoose.model('Comment', commentSchema);
