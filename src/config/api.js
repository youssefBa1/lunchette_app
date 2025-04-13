import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        message: "La requête a pris trop de temps à répondre.",
      });
    }

    if (!error.response) {
      return Promise.reject({
        message:
          "Impossible de se connecter au serveur. Veuillez vérifier votre connexion.",
      });
    }

    return Promise.reject(error.response.data);
  }
);

export default api;
