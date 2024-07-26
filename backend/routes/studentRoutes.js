const express = require('express');
const { getAssignments, submitAssignment } = require('../controllers/studentController');

const router = express.Router();

router.get('/get_assignments', getAssignments);
router.post('/submit', submitAssignment);

module.exports = router;
