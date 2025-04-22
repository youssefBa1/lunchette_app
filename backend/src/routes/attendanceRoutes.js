const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// Get attendance records by date range
router.get("/by-date-range", attendanceController.getAttendanceByDateRange);

// Get attendance records for a specific employee
router.get("/employee/:employeeId", attendanceController.getEmployeeAttendance);

// Get attendance summary
router.get("/summary", attendanceController.getAttendanceSummary);

// Create new attendance record
router.post("/", attendanceController.createAttendance);

// Update attendance record
router.put("/:id", attendanceController.updateAttendance);

// Delete attendance record
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;
