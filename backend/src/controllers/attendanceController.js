const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const attendanceValidationSchema = require("../validation/attendanceValidation");

// Get all attendance records for a date range
exports.getAttendanceByDateRange = async (req, res) => {
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

    const attendance = await Attendance.find({
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .populate("employee", "name phoneNumber employeeType")
      .sort({ date: 1, checkInTime: 1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance for a specific employee
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      employee: employeeId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create attendance record
exports.createAttendance = async (req, res) => {
  try {
    const { error } = attendanceValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    // Check if employee exists
    const employee = await Employee.findById(req.body.employee);
    if (!employee) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    // Check if attendance record already exists for this employee and date
    const existingAttendance = await Attendance.findOne({
      employee: req.body.employee,
      date: new Date(req.body.date),
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Un enregistrement de présence existe déjà pour cette date",
      });
    }

    // Calculate work hours if both check-in and check-out times are provided
    if (req.body.checkInTime && req.body.checkOutTime) {
      const checkIn = new Date(`1970-01-01T${req.body.checkInTime}`);
      const checkOut = new Date(`1970-01-01T${req.body.checkOutTime}`);
      req.body.workHours =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }

    const attendance = new Attendance(req.body);
    const newAttendance = await attendance.save();
    await newAttendance.populate("employee", "name phoneNumber employeeType");

    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update attendance record
exports.updateAttendance = async (req, res) => {
  try {
    const { error } = attendanceValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    // Calculate work hours if both check-in and check-out times are provided
    if (req.body.checkInTime && req.body.checkOutTime) {
      const checkIn = new Date(`1970-01-01T${req.body.checkInTime}`);
      const checkOut = new Date(`1970-01-01T${req.body.checkOutTime}`);
      req.body.workHours =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("employee", "name phoneNumber employeeType");

    if (!attendance) {
      return res.status(404).json({ message: "Enregistrement non trouvé" });
    }

    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Enregistrement non trouvé" });
    }
    await attendance.deleteOne();
    res.json({ message: "Enregistrement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance summary for a date range
exports.getAttendanceSummary = async (req, res) => {
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

    const summary = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: "$employee",
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0],
            },
          },
          absentDays: {
            $sum: {
              $cond: [{ $eq: ["$status", "absent"] }, 1, 0],
            },
          },
          halfDays: {
            $sum: {
              $cond: [{ $eq: ["$status", "half-day"] }, 1, 0],
            },
          },
          lateDays: {
            $sum: {
              $cond: [{ $eq: ["$status", "late"] }, 1, 0],
            },
          },
          totalWorkHours: { $sum: "$workHours" },
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
          absentDays: 1,
          halfDays: 1,
          lateDays: 1,
          totalWorkHours: 1,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
