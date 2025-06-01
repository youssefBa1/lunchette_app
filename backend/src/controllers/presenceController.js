const Presence = require("../models/Presence");
const Employee = require("../models/Employee");
const presenceValidationSchema = require("../validation/presenceValidation");

// Helper function to check if an employee is late
const isEmployeeLate = (checkInTime, shiftStart, lateThreshold) => {
  const [checkInHour, checkInMinute] = checkInTime.split(":").map(Number);
  const [shiftHour, shiftMinute] = shiftStart.split(":").map(Number);

  const checkInDate = new Date(2000, 0, 1, checkInHour, checkInMinute);
  const shiftDate = new Date(2000, 0, 1, shiftHour, shiftMinute);

  // Add late threshold to shift start time
  shiftDate.setMinutes(shiftDate.getMinutes() + lateThreshold);

  return checkInDate > shiftDate;
};

// Get all presence records
exports.getAllPresence = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const presence = await Presence.find(query)
      .populate(
        "employee",
        "name phoneNumber employeeType shiftStart shiftEnd lateThreshold"
      )
      .sort({ date: -1, checkInTime: -1 });

    res.json(presence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get presence records for a specific employee
exports.getEmployeePresence = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { employee: employeeId };

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const presence = await Presence.find(query)
      .populate(
        "employee",
        "name phoneNumber employeeType shiftStart shiftEnd lateThreshold"
      )
      .sort({ date: -1 });
    res.json(presence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create presence record
exports.createPresence = async (req, res) => {
  try {
    const { error } = presenceValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    // Check if employee exists and get their shift information
    const employee = await Employee.findById(req.body.employee);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if presence record already exists for this employee and date
    const existingPresence = await Presence.findOne({
      employee: req.body.employee,
      date: new Date(req.body.date),
    });

    if (existingPresence) {
      return res.status(400).json({
        message: "A presence record already exists for this date",
      });
    }

    // If status is "present", check if employee is late based on shift start time
    if (req.body.status === "present" && req.body.checkInTime) {
      const isLate = isEmployeeLate(
        req.body.checkInTime,
        employee.shiftStart,
        employee.lateThreshold
      );
      if (isLate) {
        req.body.status = "late";
      }
    }

    const presence = new Presence(req.body);
    const newPresence = await presence.save();
    await newPresence.populate(
      "employee",
      "name phoneNumber employeeType shiftStart shiftEnd lateThreshold"
    );

    res.status(201).json(newPresence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update presence record
exports.updatePresence = async (req, res) => {
  try {
    const { error } = presenceValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const presence = await Presence.findById(req.params.id);
    if (!presence) {
      return res.status(404).json({ message: "Presence record not found" });
    }

    // Get employee information for late check
    const employee = await Employee.findById(presence.employee);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // If status is being changed to "present", check if employee is late
    if (req.body.status === "present" && req.body.checkInTime) {
      const isLate = isEmployeeLate(
        req.body.checkInTime,
        employee.shiftStart,
        employee.lateThreshold
      );
      if (isLate) {
        req.body.status = "late";
      }
    }

    // Calculate total hours if both check-in and check-out times are provided
    if (req.body.checkInTime && req.body.checkOutTime) {
      const [checkInHour, checkInMinute] = req.body.checkInTime
        .split(":")
        .map(Number);
      const [checkOutHour, checkOutMinute] = req.body.checkOutTime
        .split(":")
        .map(Number);

      const checkIn = new Date(2000, 0, 1, checkInHour, checkInMinute);
      const checkOut = new Date(2000, 0, 1, checkOutHour, checkOutMinute);

      // Handle case where checkout is on the next day
      if (checkOut < checkIn) {
        checkOut.setDate(checkOut.getDate() + 1);
      }

      const totalHours = (checkOut - checkIn) / (1000 * 60 * 60);
      req.body.totalHours = Math.round(totalHours * 10) / 10; // Round to 1 decimal place
    }

    Object.assign(presence, req.body);
    const updatedPresence = await presence.save();
    await updatedPresence.populate(
      "employee",
      "name phoneNumber employeeType shiftStart shiftEnd lateThreshold"
    );

    res.json(updatedPresence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark day off
exports.markDayOff = async (req, res) => {
  try {
    const { employeeId, date } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if presence record already exists
    let presence = await Presence.findOne({
      employee: employeeId,
      date: new Date(date),
    });

    if (presence) {
      // Update existing record
      presence.status = "excused";
      presence.checkInTime = "00:00";
      presence.checkOutTime = null;
      presence.totalHours = 0;
    } else {
      // Create new record
      presence = new Presence({
        employee: employeeId,
        date: new Date(date),
        status: "excused",
        checkInTime: "00:00",
        checkOutTime: null,
        totalHours: 0,
      });
    }

    const savedPresence = await presence.save();
    await savedPresence.populate(
      "employee",
      "name phoneNumber employeeType shiftStart shiftEnd lateThreshold"
    );

    res.json(savedPresence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark as absent
exports.markAsAbsent = async (req, res) => {
  try {
    const { employeeId, date } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if presence record already exists
    let presence = await Presence.findOne({
      employee: employeeId,
      date: new Date(date),
    });

    if (presence) {
      // Update existing record
      presence.status = "absent";
      presence.checkInTime = "00:00";
      presence.checkOutTime = null;
      presence.totalHours = 0;
    } else {
      // Create new record
      presence = new Presence({
        employee: employeeId,
        date: new Date(date),
        status: "absent",
        checkInTime: "00:00",
        checkOutTime: null,
        totalHours: 0,
      });
    }

    const savedPresence = await presence.save();
    await savedPresence.populate(
      "employee",
      "name phoneNumber employeeType shiftStart shiftEnd lateThreshold"
    );

    res.json(savedPresence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete presence record
exports.deletePresence = async (req, res) => {
  try {
    const presence = await Presence.findById(req.params.id);
    if (!presence) {
      return res.status(404).json({ message: "Enregistrement non trouvé" });
    }
    await presence.deleteOne();
    res.json({ message: "Enregistrement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get presence summary for a date range
exports.getPresenceSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Les dates de début et de fin sont requises",
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const summary = await Presence.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$employee",
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
          lateDays: {
            $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] },
          },
          absentDays: {
            $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
          },
          excusedDays: {
            $sum: { $cond: [{ $eq: ["$status", "excused"] }, 1, 0] },
          },
          totalHours: { $sum: "$totalHours" },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      {
        $unwind: "$employeeDetails",
      },
      {
        $project: {
          name: "$employeeDetails.name",
          employeeType: "$employeeDetails.employeeType",
          totalDays: 1,
          presentDays: 1,
          lateDays: 1,
          absentDays: 1,
          excusedDays: 1,
          totalHours: 1,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
