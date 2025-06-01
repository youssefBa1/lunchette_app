const DailyIncome = require("../models/DailyIncome");

class StatsController {
  // Get daily income statistics
  async getDailyIncome(req, res) {
    try {
      const { date } = req.query;
      let queryDate = new Date();

      if (date) {
        queryDate = new Date(date);
      }
      queryDate.setHours(0, 0, 0, 0);

      const dailyStats = await DailyIncome.find({ date: queryDate })
        .populate("product_id", "name")
        .sort({ totalRevenue: -1 });

      const totalDailyIncome = dailyStats.reduce(
        (sum, stat) => sum + stat.totalRevenue,
        0
      );

      res.json({
        date: queryDate,
        totalDailyIncome,
        productStats: dailyStats,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching daily income", error: error.message });
    }
  }

  // Get daily income for a specific product
  async getProductDailyIncome(req, res) {
    try {
      const { productId } = req.params;
      const { date } = req.query;
      let queryDate = new Date();

      if (date) {
        queryDate = new Date(date);
      }
      queryDate.setHours(0, 0, 0, 0);

      const productStats = await DailyIncome.findOne({
        date: queryDate,
        product_id: productId,
      }).populate("product_id", "name");

      if (!productStats) {
        return res.json({
          date: queryDate,
          product_id: productId,
          quantitySold: 0,
          totalRevenue: 0,
        });
      }

      res.json(productStats);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching product daily income",
        error: error.message,
      });
    }
  }
}

module.exports = new StatsController();
