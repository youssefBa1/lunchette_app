const Employee = require("../models/Employee");
const employeeValidationSchema = require("../validation/employeeValidation");

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const { error } = employeeValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const employee = new Employee(req.body);
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single employee
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const { error } = employeeValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update employee fields
    Object.assign(employee, req.body);
    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await employee.deleteOne();
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle employee active status
exports.toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.isActive = !employee.isActive;
    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
