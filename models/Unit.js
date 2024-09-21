const mongoose = require('mongoose');
const { Schema } = mongoose;

const unitSchema = new Schema({
  title: { type: String, required: true },
  sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }], // Array of session IDs
});

module.exports = mongoose.model('Unit', unitSchema);
