// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// Allow setting auth token for user sessions
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("hc_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("hc_token");
  }
};

export default api;
