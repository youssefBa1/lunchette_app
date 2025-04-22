const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

// Get all employees
router.get("/", employeeController.getAllEmployees);

// Create a new employee
router.post("/", employeeController.createEmployee);

// Get a single employee
router.get("/:id", employeeController.getEmployee);

// Update an employee
router.put("/:id", employeeController.updateEmployee);

// Delete an employee
router.delete("/:id", employeeController.deleteEmployee);

// Toggle employee status
router.patch("/:id/toggle-status", employeeController.toggleEmployeeStatus);

module.exports = router;
