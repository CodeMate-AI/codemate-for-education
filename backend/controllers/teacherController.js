const Assignment = require('../models/assignment');
const Submission = require('../models/submission');
const User = require('../models/User');

const getAssignments = async (req, res) => {
    const { institute_id, teacher_id } = req.query;

    const assignments = await Assignment.find({ teacher_id });
    const submissions = await Submission.find({ teacher_id });
    const students = await User.find({ institute_id, teachers_ids: teacher_id });

    res.status(200).json({ status: 'success', assignments, submissions, students });
};
const addAssignment = async (req, res) => {
  // Add logic to add assignment
};

module.exports = { getAssignments,addAssignment };


