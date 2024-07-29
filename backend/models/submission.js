const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    _id: { type: String, required: true,unique:true }, 
    id: { type: String, required: true,unique:true }, 
    teacher_id: { type: String, required: true },
    student_id: { type: String, required: true },
    classroom_id: { type: String, required: true },
    aid: { type: String, required: true },
    submission: { type: String, required: true },
    date_time: { type: String, required: true },
    evaluation: Object,
}, { timestamps: true });

// middleware to ensure _id is always equal to id
submissionSchema.pre('save', function(next) {
    if (this.id !== this._id) {
        this._id = this.id;
    }
    next();
});

module.exports = mongoose.model('Submission', submissionSchema);