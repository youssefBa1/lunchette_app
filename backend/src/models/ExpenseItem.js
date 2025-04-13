const mongoose = require("mongoose");

const expenseItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpenseCategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExpenseItem = mongoose.model("ExpenseItem", expenseItemSchema);

module.exports = ExpenseItem;
