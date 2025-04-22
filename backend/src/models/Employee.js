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
