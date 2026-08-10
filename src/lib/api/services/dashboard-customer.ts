import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type { AxiosErrorType } from "../../utils/api-error-types";
import type {
    shipmentsHistoryResponse,
    ActiveShipmentsResponse,
} from "@/lib/api/types/dashboard-customer";

export interface paramsCustomer {
    page: number
    limit: number
}

export const customerDashboard = {
    async getActiveShipments(): Promise<ActiveShipmentsResponse> {
        try {
            const response = await apiClient.get<ActiveShipmentsResponse>("/api/dashboard/customer/active-shipments");
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    },

    async getShipmentHistory(params: paramsCustomer): Promise<shipmentsHistoryResponse> {
        try {
            const response = await apiClient.get<shipmentsHistoryResponse>("/api/dashboard/customer/shipment-history",
                { params }
            );
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error as AxiosErrorType);
            throw new Error(errorMessage);
        }
    },
}