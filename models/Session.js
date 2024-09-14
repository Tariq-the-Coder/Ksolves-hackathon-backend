const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  title: { type: String, required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  lectures: [{ type: String }],
});

module.exports = mongoose.model('Session', sessionSchema);
