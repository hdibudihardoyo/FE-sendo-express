import type { ApiError } from "./api-error-types";
import { isAxiosError } from "./api-error-types";

export const handleApiError = (errorData: ApiError): string => {
  // Handle Validation Errors
  if (errorData.errors && Array.isArray(errorData.errors)) {
    const validationMessages = errorData.errors
      .map((error) => error.message)
      .join(", ");

    return validationMessages;
  }

  // Handle General Errors Messages
  return errorData.message || "Terjadi kesalahan. Silahkan coba lagi.";
};

// for axios errors handling
export const handleAxiosError = (error: unknown): string => {
  // non-axios errors (Error instance or unknown throw)
  if (!isAxiosError(error)) {
    return error instanceof Error
      ? error.message
      : "Terjadi kesalahan. Silahkan coba lagi.";
  }

  // handle errors response
  if (error.response?.data) {
    const errorData: ApiError = error.response.data;
    return handleApiError(errorData);
  }

  // handle network errors
  if (error.code === "ECONNABORTED") {
    return "Request timed out. Silahkan coba lagi.";
  }

  if (error.message === "Network Error") {
    return "Tidak dapat terhubung ke server. Silahkan cek kembali koneksi internet anda.";
  }

  // fallback
  return error.message || "Terjadi kesalahan. Silahkan coba lagi.";
};
