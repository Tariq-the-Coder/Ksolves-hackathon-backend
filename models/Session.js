const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema({
  title: { type: String, required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  lectures: [{ type: Schema.Types.ObjectId, ref: 'Lecture' }], // Array of lecture IDs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
