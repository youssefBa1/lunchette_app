const mongoose = require("mongoose");

const expenseCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for getting category items
expenseCategorySchema.virtual("categoryItems", {
  ref: "ExpenseCategoryItem",
  localField: "_id",
  foreignField: "category",
});

// Enable virtuals in JSON
expenseCategorySchema.set("toJSON", { virtuals: true });
expenseCategorySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("ExpenseCategory", expenseCategorySchema);
