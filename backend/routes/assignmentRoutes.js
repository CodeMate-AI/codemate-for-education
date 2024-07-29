const express = require('express');
const { addTask } = require('../controllers/assignmentController');

const router = express.Router();

router.post('/add_task', addTask);

module.exports = router;
