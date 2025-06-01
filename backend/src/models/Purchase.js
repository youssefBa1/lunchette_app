const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const purchaseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    time: {
      type: String,
      required: true,
      default: () => new Date().toLocaleTimeString(),
    },
    purchaseContent: [purchaseItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient date-based queries
purchaseSchema.index({ date: 1 });

module.exports = mongoose.model("Purchase", purchaseSchema);
