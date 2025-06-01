import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const articleApi = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/articles`);
      return response.data;
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching article:", error);
      throw error;
    }
  },

  create: async (articleData) => {
    try {
      const response = await axios.post(`${API_URL}/articles`, articleData);
      return response.data;
    } catch (error) {
      console.error("Error creating article:", error);
      throw error;
    }
  },

  update: async (id, articleData) => {
    try {
      const response = await axios.put(
        `${API_URL}/articles/${id}`,
        articleData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating article:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting article:", error);
      throw error;
    }
  },
};
