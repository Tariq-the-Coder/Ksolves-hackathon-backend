// models/Class.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  createdAt: { type: Date, default: Date.now }
});


const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  lectures: [{ type: Schema.Types.ObjectId, ref: 'Lecture' }], // Array of lecture IDs
  createdAt: { type: Date, default: Date.now }
});

const UnitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sessions: [sessionSchema], // A unit can have multiple sessions
});

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  units: [UnitSchema], // A class can have multiple units
});

module.exports = mongoose.model('Class', ClassSchema);
