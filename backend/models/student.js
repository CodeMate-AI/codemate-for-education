const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  imageUrl: { type: String },
  password: { type: String, required: true },
  institute_id: { type: String, required: true },
  classroom_id: { type: String, required: true },
  submissions: [Object],//assigned and submissions not be present in the Student collection since references are going to be used for any classroom and institute and no mixing up of assignments and submissions is allowed , we can introduce the property and values in the objects already referred in the students array of classroom object
  assigned: [Object],
}, { timestamps: true });

// pre-save middleware to ensure _id is the same as id
studentSchema.pre('save', function(next) {
  this._id = this.id;
  next();
});

module.exports = mongoose.model('Student', studentSchema);