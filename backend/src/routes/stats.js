const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

// Get daily income statistics
router.get("/daily-income", statsController.getDailyIncome);

// Get daily income for a specific product
router.get("/daily-income/:productId", statsController.getProductDailyIncome);

module.exports = router;
