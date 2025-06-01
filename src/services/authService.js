import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Backend runs on port 3000

const authService = {
  login: async (email, password) => {
    try {
      console.log("=== AUTH DEBUG: Login Attempt ===");
      console.log("Email:", email);

      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      console.log("=== AUTH DEBUG: Backend Response ===");
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      console.log("Response data type:", typeof response.data);
      console.log("Has token:", !!response.data?.token);

      // Store the entire response data
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("=== AUTH DEBUG: Storage ===");
      console.log("Stored data:", userData);
      console.log("localStorage content:", localStorage.getItem("user"));

      return userData;
    } catch (error) {
      console.error("=== AUTH DEBUG: Error ===");
      console.error("Error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    console.log("=== AUTH DEBUG: Logout ===");
    console.log("Before logout - localStorage:", localStorage.getItem("user"));
    localStorage.removeItem("user");
    console.log("After logout - localStorage:", localStorage.getItem("user"));
  },

  getCurrentUser: () => {
    try {
      console.log("=== AUTH DEBUG: Get Current User ===");
      const userStr = localStorage.getItem("user");
      console.log("Raw localStorage data:", userStr);

      if (!userStr) {
        console.log("No user data found in localStorage");
        return null;
      }

      const user = JSON.parse(userStr);
      console.log("Parsed user data:", user);
      console.log("Token exists:", !!user?.token);

      return user;
    } catch (error) {
      console.error("=== AUTH DEBUG: Get Current User Error ===");
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  isAuthenticated: () => {
    try {
      console.log("=== AUTH DEBUG: Check Authentication ===");
      const user = authService.getCurrentUser();
      const isAuth = !!user;
      console.log("Authentication status:", isAuth);
      console.log("User data:", user);
      return isAuth;
    } catch (error) {
      console.error("=== AUTH DEBUG: Authentication Check Error ===");
      console.error("Error checking auth:", error);
      return false;
    }
  },

  getToken: () => {
    try {
      console.log("=== AUTH DEBUG: Get Token ===");
      const user = authService.getCurrentUser();
      const token = user?.token;
      console.log("Token exists:", !!token);
      return token;
    } catch (error) {
      console.error("=== AUTH DEBUG: Get Token Error ===");
      console.error("Error getting token:", error);
      return null;
    }
  },

  getUserRole: () => {
    try {
      const user = authService.getCurrentUser();
      return user?.role || "worker"; // Default to worker if no role is set
    } catch (error) {
      console.error("Error getting user role:", error);
      return "worker";
    }
  },

  isAdmin: () => {
    return authService.getUserRole() === "admin";
  },

  hasAccess: (path) => {
    const role = authService.getUserRole();
    const workerAccessPaths = ["/orders", "/supplier-expenses", "/expenses"];

    if (role === "admin") {
      return true; // Admin has access to everything
    }

    return workerAccessPaths.includes(path);
  },

  getDefaultRoute: () => {
    return authService.isAdmin() ? "/" : "/orders";
  },
};

export default authService;
