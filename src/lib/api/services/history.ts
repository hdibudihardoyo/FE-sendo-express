import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type {
  HistoryParams,
  HistoryResponse,
  SingleHistoryResponse,
} from "@/lib/api/types/history";

// get all history
export const getAllHistory = async (
  params?: HistoryParams,
): Promise<HistoryResponse> => {
  try {
    const { data } = await apiClient.get<HistoryResponse>(
      "/api/shipments/histories",
      { params },
    );
    return data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

// get history by id
export const getHistoryById = async (
  historyId: number,
): Promise<SingleHistoryResponse> => {
  try {
    const { data } = await apiClient.get<SingleHistoryResponse>(
      `/api/shipments/histories/${historyId}`,
    );
    return data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};
