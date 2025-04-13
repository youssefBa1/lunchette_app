const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    categoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpenseCategoryItem",
      required: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Amount must be a positive number",
      },
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to get the expense category through category item
expenseSchema.virtual("category", {
  ref: "ExpenseCategoryItem",
  localField: "categoryItem",
  foreignField: "_id",
  justOne: true,
  populate: {
    path: "category",
    model: "ExpenseCategory",
  },
});

// Enable virtuals in JSON
expenseSchema.set("toJSON", { virtuals: true });
expenseSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Expense", expenseSchema);
