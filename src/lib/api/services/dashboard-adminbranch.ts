import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type { AxiosErrorType } from "../../utils/api-error-types";
import type {
  AdminBranchDashboardSummaryResponse,
  RecentScanLogsResponse,
  ActivityTrendResponse,
  StuckPackagesAlertResponse,
} from "../types/dashboard-adminbranch";

export const AdminBranchDashboard = {
  async getAdminBranchDashboardSummary(): Promise<AdminBranchDashboardSummaryResponse> {
    try {
      const response = await apiClient.get<AdminBranchDashboardSummaryResponse>(
        "/api/dashboard/admin-branch/summary",
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  async getRecentScanLogs({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<RecentScanLogsResponse> {
    try {
      const response = await apiClient.get<RecentScanLogsResponse>(
        "/api/dashboard/admin-branch/recent-scans",
        {
          params: { page, limit },
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  async getActivityTrend(days: number): Promise<ActivityTrendResponse> {
    try {
      const response = await apiClient.get<ActivityTrendResponse>(
        "/api/dashboard/admin-branch/activity-trend",
        {
          params: { days },
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  async getStuckPackagesAlert({
    hours,
    page,
    limit,
  }: {
    hours?: number;
    page?: number;
    limit?: number;
  }): Promise<StuckPackagesAlertResponse> {
    try {
      const response = await apiClient.get<StuckPackagesAlertResponse>(
        "/api/dashboard/admin-branch/stuck-packages",
        {
          params: { hours, page, limit },
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },
};
