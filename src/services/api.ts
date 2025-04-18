// This file is kept for compatibility with existing code
// All actual API calls have been replaced with mock implementations in the respective service files

import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// These interceptors are kept for compatibility
// They won't be used since we're using mock data
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      console.error("Unable to connect to the server. Please check if the server is running.");
    }
    return Promise.reject(error);
  }
);

export default api;
