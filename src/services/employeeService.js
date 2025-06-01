const API_URL = "http://localhost:3000/api";

export const employeeService = {
  async getAllEmployees() {
    const response = await fetch(`${API_URL}/employees`);
    if (!response.ok) throw new Error("Failed to fetch employees");
    return response.json();
  },

  async getEmployee(id) {
    const response = await fetch(`${API_URL}/employees/${id}`);
    if (!response.ok) throw new Error("Failed to fetch employee");
    return response.json();
  },

  async createEmployee(employeeData) {
    const response = await fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) throw new Error("Failed to create employee");
    return response.json();
  },

  async updateEmployee(id, employeeData) {
    // Get current employee data first
    const currentEmployee = await this.getEmployee(id);

    // Merge current data with new data, preserving existing fields
    const updatedData = {
      ...currentEmployee,
      ...employeeData,
    };

    // Remove MongoDB system fields that are not allowed in updates
    delete updatedData._id;
    delete updatedData.createdAt;
    delete updatedData.updatedAt;
    delete updatedData.__v;

    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error("Failed to update employee");
    return response.json();
  },

  async deleteEmployee(id) {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete employee");
    return response.json();
  },

  async toggleEmployeeStatus(id) {
    const response = await fetch(`${API_URL}/employees/${id}/toggle-status`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to toggle employee status");
    return response.json();
  },
};
