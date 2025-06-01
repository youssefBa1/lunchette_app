const mongoose = require("mongoose");

const dailyIncomeSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantitySold: {
      type: Number,
      required: true,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient date and product queries
dailyIncomeSchema.index({ date: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model("DailyIncome", dailyIncomeSchema);
