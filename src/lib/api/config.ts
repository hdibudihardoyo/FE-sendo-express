// Configuration for API services

const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  baseURL: isDevelopment
    ? import.meta.env.VITE_API_DEV_BASE_URL
    : import.meta.env.VITE_API_BASE_URL,

  timeout: 10000,
  retries: 3,
} as const;
