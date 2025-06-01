import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      console.log("API Response - Get All Users:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error.response?.data || error.message;
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      console.log("API Request - Create User:", userData); // Debug log
      const response = await axios.post(`${API_URL}/users/register`, userData);
      console.log("API Response - Create User:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error.response?.data || error.message;
    }
  },

  // Update a user
  updateUser: async (id, userData) => {
    try {
      console.log("API Request - Update User:", { id, userData }); // Debug log
      const response = await axios.put(`${API_URL}/users/${id}`, userData);
      console.log("API Response - Update User:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error.response?.data || error.message;
    }
  },

  // Delete a user
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error.response?.data || error.message;
    }
  },

  // Update user role
  updateUserRole: async (id, role) => {
    try {
      const response = await axios.put(`${API_URL}/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error.response?.data || error.message;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile/me`);
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error.response?.data || error.message;
    }
  },

  updateCurrentUser: async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile/me`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating current user:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
