const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Get all orders
router.get("/", orderController.getAllOrders);

// Get orders by date
router.get("/by-date", orderController.getOrdersByDate);

// Create a new order
router.post("/", orderController.createOrder);

// Get a specific order
router.get("/:id", orderController.getOrder);

// Update a specific order
router.put("/:id", orderController.updateOrder);

// Delete a specific order
router.delete("/:id", orderController.deleteOrder);

// Update order status
router.patch("/:id/status", orderController.updateOrderStatus);

// Bulk create orders
router.post("/bulk", orderController.createManyOrders);

module.exports = router;
