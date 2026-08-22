import axios from "axios";
import axiosRetry from "axios-retry";
import { API_CONFIG } from "./config";

// create axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// auto-retry failed requests (network errors, timeouts, 5xx)
axiosRetry(apiClient, {
  retries: API_CONFIG.retries,
  retryDelay: axiosRetry.exponentialDelay,
  shouldResetTimeout: true,
});

// request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
