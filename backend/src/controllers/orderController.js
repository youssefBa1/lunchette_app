const orderService = require("../services/orderService");
const Order = require("../models/Order");
const Product = require("../models/Product");
const validateOrder = require("../validation/orderValidation");

class OrderController {
  async createOrder(req, res) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrder(req, res) {
    try {
      const order = await Order.findById(req.params.id).populate(
        "orderContent.product_id",
        "name price"
      );
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateOrder(req, res) {
    // Validate request body
    const { error } = validateOrder(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    try {
      // Verify all products exist
      const productIds = req.body.orderContent.map((item) => item.product_id);
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
      let calculatedTotalPrice = 0;
      const orderContent = req.body.orderContent.map((item) => {
        const itemPrice = productPrices[item.product_id] * item.quantity;
        calculatedTotalPrice += itemPrice;
        return {
          ...item,
          price: itemPrice,
        };
      });

      // Prepare update data
      const updateData = {
        ...req.body,
        orderContent,
        totalPrice: req.body.totalPrice || calculatedTotalPrice,
        remainingAmount:
          (req.body.totalPrice || calculatedTotalPrice) -
          (req.body.hasAdvancePayment ? req.body.advanceAmount || 0 : 0),
      };

      const order = await orderService.updateOrder(req.params.id, updateData);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const order = await orderService.deleteOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrdersByDate(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ message: "Date parameter is required" });
      }

      // Validate date format
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: "Invalid date format. Please use YYYY-MM-DD format",
          providedDate: date,
        });
      }

      const orders = await orderService.getOrdersByDate(date);
      res.json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error fetching orders by date: ${error.message}` });
    }
  }

  async createManyOrders(req, res) {
    try {
      const orders = req.body;

      if (!Array.isArray(orders)) {
        return res
          .status(400)
          .json({ message: "Request body must be an array of orders" });
      }

      // Validate each order
      for (const order of orders) {
        const { error } = validateOrder(order);
        if (error) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.details.map((detail) => detail.message),
            order: order,
          });
        }
      }

      // Verify all products exist and calculate prices
      const productIds = [
        ...new Set(
          orders.flatMap((order) =>
            order.orderContent.map((item) => item.product_id)
          )
        ),
      ];

      const products = await Product.find({ _id: { $in: productIds } });
      const productPrices = {};
      products.forEach((product) => {
        productPrices[product._id.toString()] = product.price;
      });

      // Calculate prices for each order
      const ordersWithPrices = orders.map((order) => {
        let totalPrice = 0;
        const orderContent = order.orderContent.map((item) => {
          const itemPrice = productPrices[item.product_id] * item.quantity;
          totalPrice += itemPrice;
          return {
            ...item,
            price: itemPrice,
          };
        });

        return {
          ...order,
          orderContent,
          totalPrice: order.totalPrice || totalPrice,
          remainingAmount:
            (order.totalPrice || totalPrice) -
            (order.hasAdvancePayment ? order.advanceAmount || 0 : 0),
        };
      });

      const createdOrders = await Order.insertMany(ordersWithPrices);

      // Update daily income for each order
      for (const order of createdOrders) {
        await orderService.updateDailyIncome(order.orderContent);
      }

      res.status(201).json(createdOrders);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;

      // Validate status value
      if (!status || !["notready", "ready", "payed"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
          details: "Status must be one of: notready, ready, payed",
        });
      }

      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Only update the status field
      order.status = status;
      await order.save();

      // Return the updated order
      await order.populate("orderContent.product_id", "name price");
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
