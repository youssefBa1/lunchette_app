const mongoose = require("mongoose");

const presenceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: true,
    },
    checkInTime: {
      type: String,
      required: true,
    },
    checkOutTime: {
      type: String,
      default: null,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure one presence record per employee per day
presenceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Presence = mongoose.model("Presence", presenceSchema);

module.exports = Presence;
