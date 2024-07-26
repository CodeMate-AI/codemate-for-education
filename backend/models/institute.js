const mongoose = require('mongoose');
const { Schema } = mongoose;

const instituteSchema = new Schema({
  name: { type: String, unique: true, required: true },
  id: { type: String, required: true, unique: true },
  classrooms:[{ type: Schema.Types.ObjectId, ref: 'Classroom' }],
  teachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }],
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  assignments: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }],
  submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }],
}, { timestamps: true });

module.exports = mongoose.model('Institute', instituteSchema);
