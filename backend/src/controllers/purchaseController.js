const Purchase = require("../models/Purchase");
const Product = require("../models/Product");

class PurchaseController {
  // Create a new purchase
  async createPurchase(req, res) {
    try {
      const { purchaseContent } = req.body;

      // Verify all products exist
      const productIds = purchaseContent.map((item) => item.product_id);
      const products = await Product.find({ _id: { $in: productIds } });

      if (products.length !== productIds.length) {
        return res
          .status(400)
          .json({ message: "One or more products not found" });
      }

      // Create product price lookup
      const productPrices = {};
      products.forEach((product) => {
        productPrices[product._id.toString()] = product.price;
      });

      // Calculate total price and set individual item prices
      let totalPrice = 0;
      const purchaseItems = purchaseContent.map((item) => {
        const itemPrice = productPrices[item.product_id] * item.quantity;
        totalPrice += itemPrice;
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price: itemPrice,
        };
      });

      const purchase = new Purchase({
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        purchaseContent: purchaseItems,
        totalPrice,
      });

      const savedPurchase = await purchase.save();
      await savedPurchase.populate("purchaseContent.product_id", "name price");
      res.status(201).json(savedPurchase);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all purchases
  async getAllPurchases(req, res) {
    try {
      const purchases = await Purchase.find()
        .populate("purchaseContent.product_id", "name price")
        .sort({ date: -1, time: -1 });
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get purchases by date
  async getPurchasesByDate(req, res) {
    try {
      const { date } = req.query;
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const purchases = await Purchase.find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
        .populate("purchaseContent.product_id", "name price")
        .sort({ time: 1 });

      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get a single purchase
  async getPurchase(req, res) {
    try {
      const purchase = await Purchase.findById(req.params.id).populate(
        "purchaseContent.product_id",
        "name price"
      );
      if (purchase) {
        res.json(purchase);
      } else {
        res.status(404).json({ message: "Purchase not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete a purchase
  async deletePurchase(req, res) {
    try {
      const purchase = await Purchase.findById(req.params.id);
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      await purchase.deleteOne();
      res.json({ message: "Purchase deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new PurchaseController();
