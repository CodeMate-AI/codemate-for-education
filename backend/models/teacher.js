const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  imageUrl: { type: String },
  password: { type: String, required: true },
  institute_id: { type: String, required: true },
  classroom_id: { type: String, required: true },
  assignments: [Object],//assignments and submissions not be present in the Teacher collection since references are going to be used for any classroom and institute and no mixing up of assignments and submissions is allowed , we can introduce the property and values in the objects already referred in the teachers array of classroom object
  submissions: [Object],
}, { timestamps: true });

teacherSchema.pre('save', function(next) {
  this._id = this.id;
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);