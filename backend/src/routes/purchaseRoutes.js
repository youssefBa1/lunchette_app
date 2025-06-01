const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

// Create a new purchase
router.post("/", purchaseController.createPurchase);

// Get all purchases
router.get("/", purchaseController.getAllPurchases);

// Get purchases by date
router.get("/by-date", purchaseController.getPurchasesByDate);

// Get a single purchase
router.get("/:id", purchaseController.getPurchase);

// Delete a purchase
router.delete("/:id", purchaseController.deletePurchase);

module.exports = router;
