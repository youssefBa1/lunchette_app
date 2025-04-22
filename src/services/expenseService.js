const API_URL = "http://localhost:3000/api";

export const expenseService = {
  async getAllExpenses() {
    const response = await fetch(`${API_URL}/expenses`);
    if (!response.ok) throw new Error("Failed to fetch expenses");
    return response.json();
  },

  async getExpensesByDateRange(startDate, endDate = startDate) {
    const url = `${API_URL}/expenses/date-range?startDate=${startDate}&endDate=${endDate}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Failed to fetch expenses by date range"
      );
    }
    return response.json();
  },

  async createExpense(expenseData) {
    const response = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error("Failed to create expense");
    return response.json();
  },

  async updateExpense(id, expenseData) {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error("Failed to update expense");
    return response.json();
  },

  async deleteExpense(id) {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete expense");
    return response.json();
  },

  async getAllExpenseCategories() {
    const response = await fetch(`${API_URL}/expenses/categories`);
    if (!response.ok) throw new Error("Failed to fetch expense categories");
    return response.json();
  },

  async getAllExpenseCategoryItems() {
    const response = await fetch(`${API_URL}/expenses/category-items`);
    if (!response.ok) throw new Error("Failed to fetch expense category items");
    return response.json();
  },
};
