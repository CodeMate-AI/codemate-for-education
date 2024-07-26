const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  imageUrl: { type: String },
  password: { type: String, required: true },
  institute_id: { type: String, required: true },
  classroom_id: { type: String, required: true },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
}, { timestamps: true });

teacherSchema.pre('save', function(next) {
  this._id = this.id;
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);