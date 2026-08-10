import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type { AxiosErrorType } from "../../utils/api-error-types";
import type {
    DashboardSummaryResponse,
    DailyRevenueChartResponse,
    VolumeBranchResponse,
    ShipmentStatusDistributionResponse,
    BranchPerformanceRankingResponse,
    RecentShipmentsResponse,
    DashboardAlertsResponse,
} from "../types/dashboard-superadmin";

export const SuperAdminDashboard  = {
    async getDashboardSummary(): Promise<DashboardSummaryResponse> {
        try {
        const response = await apiClient.get<DashboardSummaryResponse>("/api/dashboard/superadmin/summary");
        return response.data;
        } catch (error) {
        const errorMessage = handleAxiosError(error as AxiosErrorType);
        throw new Error(errorMessage);
        }
    },
    async getDailyRevenueChart(days: number): Promise<DailyRevenueChartResponse> {
        try {
            const response = await apiClient.get<DailyRevenueChartResponse>("/api/dashboard/superadmin/revenue", {
                params: { days },
            });
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    },
    async getVolumeByBranch(limit: number): Promise<VolumeBranchResponse> {
        try {
            const response = await apiClient.get<VolumeBranchResponse>("/api/dashboard/superadmin/shipment-volume", {
                params: { limit },
            });
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    },
    async getShipmentStatusDistribution(): Promise<ShipmentStatusDistributionResponse> {
        try {
            const response = await apiClient.get<ShipmentStatusDistributionResponse>("/api/dashboard/superadmin/shipment-status");
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    },
    async getBranchPerformanceRanking(): Promise<BranchPerformanceRankingResponse> {
        try {
            const response = await apiClient.get<BranchPerformanceRankingResponse>("/api/dashboard/superadmin/branch-ranking");
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    },
    async getRecentShipments({ limit, paymentStatus, page  }: { limit: number; paymentStatus?: string; page: number }): Promise<RecentShipmentsResponse> {
        try {
            const response = await apiClient.get<RecentShipmentsResponse>("/api/dashboard/superadmin/recent-shipments", {
                params: { limit, paymentStatus, page },
            });
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    },
    async getDashboardAlerts(): Promise<DashboardAlertsResponse> {
        try {
            const response = await apiClient.get<DashboardAlertsResponse>("/api/dashboard/superadmin/alerts");
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    }
}
