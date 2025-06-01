const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    salaryType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    employeeType: {
      type: String,
      enum: ["regular", "backup"],
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    shiftStart: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      default: "09:00",
    },
    shiftEnd: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      default: "17:00",
    },
    lateThreshold: {
      type: Number,
      default: 10,
      min: 0,
      max: 60,
      description: "Minutes allowed after shift start before marking as late",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to ensure backup employees have daily salary type
employeeSchema.pre("save", function (next) {
  if (this.employeeType === "backup") {
    this.salaryType = "daily";
  }
  next();
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
