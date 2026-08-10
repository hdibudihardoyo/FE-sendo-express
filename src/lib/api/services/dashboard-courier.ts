import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type { AxiosErrorType } from "../../utils/api-error-types";
import type {
    DashboardSummaryResponse,
    CourierTaskListResponse,
    CourierRouteMapResponse,
    CourierOnGoingPackagesResponse,
} from "../types/dashboard-courier";

export interface paramsCourier {
    date: string;
    page: number;
    limit: number;
}

export const courierDashboard = {
    async getDashboardCourierSummary(params: paramsCourier): Promise<DashboardSummaryResponse> {
        try {
            const response = await apiClient.get<DashboardSummaryResponse>("/api/dashboard/courier/summary", { params });
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    },

    async getCourierTaskList(params: paramsCourier): Promise<CourierTaskListResponse> {
        try {
            const response = await apiClient.get<CourierTaskListResponse>("/api/dashboard/courier/tasks", { params });
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    },

    async getCourierRouteMap(): Promise<CourierRouteMapResponse> {
        try {
            const response = await apiClient.get<CourierRouteMapResponse>("/api/dashboard/courier/route");
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    },

    async getCourierOnGoingPackages(): Promise<CourierOnGoingPackagesResponse> {
        try {
            const response = await apiClient.get<CourierOnGoingPackagesResponse>("/api/dashboard/courier/on-going-packages");
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    }
}