const User = require('../models/User');
const Assignment = require('../models/assignment');
const Submission = require('../models/submission');

const getAssignments = async (req, res) => {
    const { institute_id, student_id } = req.query;

    const student = await User.findById(student_id);
    if (!student) {
        return res.status(404).json({ status: 'failure', message: 'Student not found' });
    }

    const assignments = await Assignment.find({ _id: { $in: student.assigned.map(a => a.aid) } });
    const submissions = await Submission.find({ student_id });

    res.status(200).json({ status: 'success', assigned: assignments, submissions });
};

const submitAssignment = async (req, res) => {
    const { institute_id, student_id, assignment_id } = req.query;
    const { teacher_id, submission, date_time, evaluation } = req.body;

    const newSubmission = new Submission({
        teacher_id,
        student_id,
        aid: assignment_id,
        submission,
        date_time,
        evaluation,
    });

    await newSubmission.save();
    res.status(201).json({ status: 'success', message: 'Assignment submitted successfully' });
};

module.exports = { getAssignments, submitAssignment };
