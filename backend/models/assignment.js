const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    teacher_id: { type: String, required: true },
    classroom_id: { type: String, required: true },
    institute_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    problem_statement: { type: String, required: true },
    due_date: { type: Number, required: true },
    difficulty: { type: String, required: true },
    attachment: String,
    sample_input: String,
    sample_output: String,
    parameters: String,
    languagesAllowed: [String]
}, { timestamps: true });

// pre-save middleware to set _id to the value of id
assignmentSchema.pre('save', function(next) {
    this._id = this.id;
    next();
});

module.exports = mongoose.model('Assignment', assignmentSchema);