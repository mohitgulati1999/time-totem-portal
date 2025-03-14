
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// GET all attendance records
router.get('/', attendanceController.getAttendance);

// GET attendance records for a specific user
router.get('/user/:userId', attendanceController.getUserAttendance);

// POST check in a user
router.post('/checkin', attendanceController.checkIn);

// POST check out a user
router.post('/checkout', attendanceController.checkOut);

// POST toggle check in/out
router.post('/toggle', attendanceController.toggleAttendance);

// DELETE an attendance record
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
