const Assignment = require('../models/assignment');
const Submission = require('../models/submission');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const Institute = require('../models/Institute');

const getAssignments = async (req, res) => {
  const { institute_id, classroom_id, teacher_id } = req.query;

  try {
      const institute = await Institute.findById(institute_id);
      if (!institute) {
          return res.status(404).json({ status: 'failure', message: 'Institute not found' });
      }

      const classroom = institute.classrooms.find(c => c.id === classroom_id);
      if (!classroom) {
          return res.status(404).json({ status: 'failure', message: 'Classroom not found' });
      }

      const teacher = classroom.teachers.find(s => s.id === teacher_id);
      if (!teacher) {
          return res.status(404).json({ status: 'failure', message: 'Student not found' });
      }

      res.status(200).json({ status: 'success', assigned: teacher.assigned , submissions:teacher.submissions });
  } catch (error) {
      res.status(500).json({ status: 'failure', message: 'Server error', error });
  }
};
const addAssignment = async (req, res) => {
  try {
    const { classroom_id, teacher_id, institute_id, assignment } = req.body;

    // generate a unique ID for the assignment
    const id = uuidv4();

    // prepare the assignment object
    const assignmentData = {
        id: id,
        teacher_id: teacher_id,
        institute_id: institute_id,
        classroom_id: classroom_id,
        title: assignment.title,
        description: assignment.description,
        problem_statement: assignment.problem_statement,
        due_date: assignment.due_date,
        difficulty: assignment.difficulty,
        attachment: assignment.attachment,
        sample_input: assignment.sample_input,
        sample_output: assignment.sample_output,
        parameters: assignment.parameters,
        languagesAllowed:assignment.languagesAllowed
    };

    // Find the institute by ID
    const institute = await Institute.findById(institute_id);
    if (!institute) {
        return res.status(404).json({ status: 'failure', message: 'Institute not found' });
    }

    // find the classroom by ID within the institute
    const classroom = institute.classrooms.find(c => c.id === classroom_id);
    if (!classroom) {
        return res.status(404).json({ status: 'failure', message: 'Classroom not found' });
    }

    // find the teacher by ID within the classroom
    const teacher = classroom.teachers.find(t => t.id === teacher_id);
    if (!teacher) {
        return res.status(404).json({ status: 'failure', message: 'Teacher not found' });
    }

    // push the assignment to each student's assigned array
    classroom.students.forEach(student => {
        student.assigned.push(assignmentData);
    });

    // push the assignment to the teacher's assignments array
    teacher.assignments.push(assignmentData);

    // save the updated institute document
    await institute.save();
    //in case there is a doubt that how the changed teacher object is reflected back in the institute object, 
    // we are using objects and arrays and they work on reference

    // Save the assignment to the Assignment schema
    const newAssignment = new Assignment(assignmentData);
    await newAssignment.save();

    res.status(201).json({ status: 'success', message: 'Assignment added successfully' });
  } catch (error) {
    res.status(500).json({ status: 'failure', message: 'Server error', error });
  }
};

module.exports = { getAssignments,addAssignment };


