import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type {
  ShipmentBranchParams,
  ScanShipmentRequest,
  ScanShipmentResponse,
  ShipmentBranchResponse,
  ShipmentBranchSummaryResponse,
  ShipmentBranchSummaryData,
} from "../types/shipment-branch";

export const shipmentBranchService = {
  async scanShipment(data: ScanShipmentRequest): Promise<ScanShipmentResponse> {
    try {
      const response = await apiClient.post<ScanShipmentResponse>(
        "/api/shipments/branches",
        data,
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  async getAllShipmentBranch(
    params?: ShipmentBranchParams,
  ): Promise<ShipmentBranchResponse> {
    try {
      const response = await apiClient.get<ShipmentBranchResponse>(
        "/api/shipments/branches",
        { params },
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  // Summary Data Shipment Branch
  async getShipmentBranchSummary(): Promise<ShipmentBranchSummaryData> {
    try {
      const response = await apiClient.get<ShipmentBranchSummaryResponse>(
        "/api/shipments/branches/summary",
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },
};
