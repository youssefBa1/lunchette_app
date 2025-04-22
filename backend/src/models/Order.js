const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
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

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhoneNumber: {
      type: String,
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    pickupTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["payed", "ready", "notready"],
      default: "notready",
    },
    orderContent: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    hasAdvancePayment: {
      type: Boolean,
      default: false,
    },
    advanceAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      default: function () {
        return (
          this.totalPrice - (this.hasAdvancePayment ? this.advanceAmount : 0)
        );
      },
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient date-based queries
orderSchema.index({ pickupDate: 1 });
orderSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Order", orderSchema);
