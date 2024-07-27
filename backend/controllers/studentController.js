const User = require('../models/User');
const Assignment = require('../models/assignment');
const Submission = require('../models/submission');
const Institute = require('../models/Institute');

const getAssignments = async (req, res) => {
    const { institute_id, classroom_id, student_id } = req.query;

    try {
        const institute = await Institute.findById(institute_id);
        if (!institute) {
            return res.status(404).json({ status: 'failure', message: 'Institute not found' });
        }

        const classroom = institute.classrooms.find(c => c.id === classroom_id);
        if (!classroom) {
            return res.status(404).json({ status: 'failure', message: 'Classroom not found' });
        }

        const student = classroom.students.find(s => s.id === student_id);
        if (!student) {
            return res.status(404).json({ status: 'failure', message: 'Student not found' });
        }

        res.status(200).json({ status: 'success', assigned: student.assigned , submissions:student.submissions });
    } catch (error) {
        res.status(500).json({ status: 'failure', message: 'Server error', error });
    }
};

const getSubmissions = async (req, res) => {
    const { institute_id, classroom_id, student_id } = req.query;

    try {
        const institute = await Institute.findById(institute_id);
        if (!institute) {
            return res.status(404).json({ status: 'failure', message: 'Institute not found' });
        }

        const classroom = institute.classrooms.find(c => c.id === classroom_id);
        if (!classroom) {
            return res.status(404).json({ status: 'failure', message: 'Classroom not found' });
        }

        const student = classroom.students.find(s => s.id === student_id);
        if (!student) {
            return res.status(404).json({ status: 'failure', message: 'Student not found' });
        }

        res.status(200).json({ status: 'success', assigned: student.assigned , submissions:student.submissions });
    } catch (error) {
        res.status(500).json({ status: 'failure', message: 'Server error', error });
    }
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

module.exports = { getAssignments, getSubmissions, submitAssignment };
