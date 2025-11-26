import axios from "axios";
import { clearToken } from "../utils/storage";

// Add response interceptor for global error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = "/admin/login";
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error);
      error.message = "Network error. Please check your connection.";
    }

    return Promise.reject(error);
  }
);

export default axios;