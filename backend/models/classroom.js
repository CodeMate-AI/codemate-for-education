const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
    _id: { type: String, required: true,unique:true },
    id: { type: String, required: true,unique:true },
    name: { type: String, required: true,unique:true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    teachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }],
    assignments: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }],
    submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }]
});

// Middleware to ensure _id is the same as id
classroomSchema.pre('save', function(next) {
    this._id = this.id;
    next();
});

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;