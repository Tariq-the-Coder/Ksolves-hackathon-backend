const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unitSchema = new Schema({
  name: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
});

module.exports = mongoose.model('Unit', unitSchema);
