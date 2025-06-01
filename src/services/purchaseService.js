const API_URL = "http://localhost:3000/api";

export const purchaseService = {
  async getAllPurchases() {
    const response = await fetch(`${API_URL}/purchases`);
    if (!response.ok) throw new Error("Failed to fetch purchases");
    return response.json();
  },

  async getPurchasesByDate(date) {
    const response = await fetch(`${API_URL}/purchases/by-date?date=${date}`);
    if (!response.ok) throw new Error("Failed to fetch purchases by date");
    return response.json();
  },

  async createPurchase(purchaseData) {
    const response = await fetch(`${API_URL}/purchases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    });
    if (!response.ok) throw new Error("Failed to create purchase");
    return response.json();
  },

  async deletePurchase(id) {
    const response = await fetch(`${API_URL}/purchases/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete purchase");
    return response.json();
  },
};
