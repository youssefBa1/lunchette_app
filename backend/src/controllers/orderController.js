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

  async getOrders(req, res) {
    try {
      const orders = await orderService.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const order = await orderService.updateOrder(req.params.id, req.body);
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
      const orders = await orderService.getOrdersByDate(date);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get all orders
  async getAllOrders(req, res) {
    try {
      const orders = await Order.find()
        .populate("orderContent.product_id", "name price")
        .sort({ pickupDate: 1, pickupTime: 1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get orders by date range
  async getOrdersByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate) {
        return res.status(400).json({ message: "Start date is required" });
      }

      const query = {
        pickupDate: {},
      };

      // Set start date
      query.pickupDate.$gte = new Date(startDate);

      // Set end date if provided, otherwise use start date
      if (endDate) {
        query.pickupDate.$lte = new Date(endDate);
      } else {
        query.pickupDate.$lte = new Date(startDate);
        query.pickupDate.$lte.setHours(23, 59, 59, 999);
      }

      const orders = await Order.find(query)
        .populate("orderContent.product_id", "name price")
        .sort({ pickupTime: 1 });

      res.json(orders);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get a single order
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

  // Update an order
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
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

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

      // Update the order
      order.customerName = req.body.customerName;
      order.customerPhoneNumber = req.body.customerPhoneNumber;
      order.pickupDate = req.body.pickupDate;
      order.pickupTime = req.body.pickupTime;
      order.status = req.body.status;
      order.orderContent = orderContent;
      order.totalPrice = req.body.totalPrice || calculatedTotalPrice;
      order.description = req.body.description;

      const updatedOrder = await order.save();
      await updatedOrder.populate("orderContent.product_id", "name price");
      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete an order
  async deleteOrder(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      await order.deleteOne();
      res.json({ message: "Order deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Add many orders at once
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
        };
      });

      const createdOrders = await Order.insertMany(ordersWithPrices);
      res.status(201).json(createdOrders);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update order status only
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
