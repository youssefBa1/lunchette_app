const express = require("express");
const router = express.Router();
const presenceController = require("../controllers/presenceController");

// Get all presence records with optional date range
router.get("/", presenceController.getAllPresence);

// Get presence summary for date range
router.get("/summary", presenceController.getPresenceSummary);

// Get presence records for a specific employee
router.get("/employee/:employeeId", presenceController.getEmployeePresence);

// Create a new presence record
router.post("/", presenceController.createPresence);

// Update a presence record
router.put("/:id", presenceController.updatePresence);

// Delete a presence record
router.delete("/:id", presenceController.deletePresence);

// Mark day off
router.post("/day-off", presenceController.markDayOff);

// Mark as absent
router.post("/absent", presenceController.markAsAbsent);

module.exports = router;
