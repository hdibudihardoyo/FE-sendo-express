import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type {
  CreateShipment,
  ShipmentsParams,
  GetAllShipmentsResponse,
  GetOneShipmentResponse,
  CreateShipmentResponse,
  TrackShipmentResponse,
  Shipment,
} from "@/lib/api/types/shipment";

export const shipmentService = {
  // create shipment
  async createShipment(data: CreateShipment): Promise<Shipment> {
    try {
      const response = await apiClient.post<CreateShipmentResponse>(
        "/api/shipments",
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  // get all shipments
  async getAllShipments(
    params?: ShipmentsParams,
  ): Promise<GetAllShipmentsResponse> {
    try {
      const response = await apiClient.get<GetAllShipmentsResponse>(
        "/api/shipments",
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  // get shipment by ID
  async getByIdShipment(shipmentId: number): Promise<Shipment> {
    try {
      const response = await apiClient.get<GetOneShipmentResponse>(
        `/api/shipments/${shipmentId}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  async trackShipment(trackingNumber: string): Promise<Shipment> {
    try {
      const response = await apiClient.post<TrackShipmentResponse>(
        "/api/shipments/trackings",
        { trackingNumber },
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  async generatePdfInvoice(shipmentId: number): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/shipments/${shipmentId}/pdf`, {
        responseType: "blob",
      });
      return response.data as Blob;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },
};
