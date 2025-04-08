const API_URL = "http://localhost:5000/api";

export const orderService = {
  async getAllOrders() {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  async getOrdersByDate(date) {
    const response = await fetch(`${API_URL}/orders/by-date?startDate=${date}`);
    if (!response.ok) throw new Error("Failed to fetch orders by date");
    return response.json();
  },

  async createOrder(orderData) {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  },

  async updateOrder(id, orderData) {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to update order");
    return response.json();
  },

  async updateOrderStatus(id, status) {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update order status");
    return response.json();
  },

  async deleteOrder(id) {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete order");
    return response.json();
  },
};
