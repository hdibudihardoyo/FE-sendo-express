// Global API types and interfaces

export interface ApiMeta {
  message: string;
  statusCode: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  success?: boolean;
}

export interface ApiResponse<T> {
  meta: ApiMeta;
  data: T;
}

export interface Pagination {
  totalData: number;
  totalPages: number;
  currentPage: number;
  currentLimit: number;
}

// Re-export all types
export * from "./auth";
export * from "./branch";
export * from "./user-address";
export * from "./profile";
export * from "./employee";
export * from "./role";
export * from "./shipment-branch";
export * from "./shipment";
export * from "./delivery";
export * from "./webhooks";
export * from "./history";
export * from "./permission";
export * from "./dashboard-adminbranch";
export * from "./dashboard-courier";
export * from "./dashboard-customer";
export * from "./dashboard-superadmin";
