const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  imageUrl: { type: String },
  password: { type: String, required: true },
  institute_id: { type: String, required: true },
  classroom_id: { type: String, required: true },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  assigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
}, { timestamps: true });

// pre-save middleware to ensure _id is the same as id
studentSchema.pre('save', function(next) {
  this._id = this.id;
  next();
});

module.exports = mongoose.model('Student', studentSchema);