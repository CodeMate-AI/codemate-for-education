const express = require('express');
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/get-assignments', teacherController.getAssignments);
router.post('/add-assignment', teacherController.addAssignment);

module.exports = router;
