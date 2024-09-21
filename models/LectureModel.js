const mongoose = require('mongoose');
const { Schema } = mongoose;

const lectureSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lecture', lectureSchema);
