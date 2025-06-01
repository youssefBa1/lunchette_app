const express = require("express");
const router = express.Router();
const regularSaleController = require("../controllers/regularSaleController");

// Get all regular sales
router.get("/", regularSaleController.getAllRegularSales);

// Get regular sales by date
router.get("/date/:date", regularSaleController.getRegularSalesByDate);

// Create a new regular sale
router.post("/", regularSaleController.createRegularSale);

// Update a regular sale
router.put("/:id", regularSaleController.updateRegularSale);

// Delete a regular sale
router.delete("/:id", regularSaleController.deleteRegularSale);

// Update sale status
router.patch("/:id/status", regularSaleController.updateSaleStatus);

module.exports = router;
