const Order = require("../models/Order");
const DailyIncome = require("../models/DailyIncome");

class OrderService {
  // Helper function to update daily income
  async updateDailyIncome(orderItems, isDeletion = false) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const item of orderItems) {
      const { product_id, quantity, price } = item;
      const revenue = quantity * price;
      const multiplier = isDeletion ? -1 : 1;

      await DailyIncome.findOneAndUpdate(
        { date: today, product_id },
        {
          $inc: {
            quantitySold: quantity * multiplier,
            totalRevenue: revenue * multiplier,
          },
        },
        { upsert: true, new: true }
      );
    }
  }

  async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      const savedOrder = await order.save();

      // Update daily income for each product in the order
      await this.updateDailyIncome(orderData.orderContent);

      return savedOrder;
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  async getOrders(filter = {}) {
    try {
      return await Order.find(filter)
        .populate("orderContent.product_id", "name price")
        .sort({ pickupDate: 1, pickupTime: 1 });
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  async updateOrder(orderId, updateData) {
    try {
      // Get the old order data
      const oldOrder = await Order.findById(orderId);
      if (!oldOrder) {
        throw new Error("Order not found");
      }

      // Update the order
      const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
        new: true,
        runValidators: true,
      });

      // If order content changed, update daily income
      if (updateData.orderContent) {
        // Remove old order's impact on daily income
        await this.updateDailyIncome(oldOrder.orderContent, true);
        // Add new order's impact on daily income
        await this.updateDailyIncome(updateData.orderContent);
      }

      return updatedOrder;
    } catch (error) {
      throw new Error(`Error updating order: ${error.message}`);
    }
  }

  async deleteOrder(orderId) {
    try {
      // Get the order data before deleting
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      // Remove order's impact on daily income
      await this.updateDailyIncome(order.orderContent, true);

      // Delete the order
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
        pickupDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
        .populate("orderContent.product_id", "name price")
        .sort({ pickupTime: 1 });
    } catch (error) {
      throw new Error(`Error fetching orders by date: ${error.message}`);
    }
  }
}

module.exports = new OrderService();
