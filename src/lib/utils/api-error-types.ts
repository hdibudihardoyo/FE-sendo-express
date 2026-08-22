// common api error types for axios error handling
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export interface AxiosErrorType {
  response?: {
    data: ApiError;
    status: number;
  };
  code?: string;
  message?: string;
}

// type guard untuk memastikan error adalah axios error
export const isAxiosError = (error: unknown): error is AxiosErrorType => {
  return Boolean(
    error &&
      typeof error === "object" &&
      ("isAxiosError" in error || "response" in error || "code" in error),
  );
};
