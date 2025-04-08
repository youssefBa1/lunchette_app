const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Get all orders
router.get("/", orderController.getAllOrders);

// Get orders by date range
router.get("/by-date", orderController.getOrdersByDateRange);

// Create a new order
router.post("/", orderController.createOrder);

// Get a specific order
router.get("/:id", orderController.getOrder);

// Update an order
router.put("/:id", orderController.updateOrder);

// Update order status only
router.patch("/:id/status", orderController.updateOrderStatus);

// Delete an order
router.delete("/:id", orderController.deleteOrder);

// Bulk create orders
router.post("/bulk", orderController.createManyOrders);

module.exports = router;
