const Assignment = require('../models/assignment');
const User = require('../models/User');

const addTask = async (req, res) => {
    const { title, description, problem_statement, due_date, difficulty, attachment, sample_input, sample_output, parameters } = req.body;
    const { institute_id, teacher_id } = req.query;

    const assignment = new Assignment({
        teacher_id,
        title,
        description,
        problem_statement,
        due_date,
        difficulty,
        attachment,
        sample_input,
        sample_output,
        parameters,
    });

    await assignment.save();

    const students = await User.find({ institute_id, teachers_ids: teacher_id });
    students.forEach(async (student) => {
        student.assigned.push({ aid: assignment._id });
        await student.save();
    });

    res.status(201).json({ status: 'success', message: 'Assignment added successfully', task_id: assignment._id });
};

module.exports = { addTask };
