const Order = require("../models/Order");

class OrderService {
  async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  async getOrders(filter = {}) {
    try {
      return await Order.find(filter).sort({ orderDate: -1, orderTime: -1 });
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  async updateOrder(orderId, updateData) {
    try {
      return await Order.findByIdAndUpdate(orderId, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(`Error updating order: ${error.message}`);
    }
  }

  async deleteOrder(orderId) {
    try {
      return await Order.findByIdAndDelete(orderId);
    } catch (error) {
      throw new Error(`Error deleting order: ${error.message}`);
    }
  }

  async getOrdersByDate(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await Order.find({
        orderDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }).sort({ orderTime: 1 });
    } catch (error) {
      throw new Error(`Error fetching orders by date: ${error.message}`);
    }
  }
}

module.exports = new OrderService();
