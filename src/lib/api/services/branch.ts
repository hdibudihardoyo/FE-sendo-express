import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type {
  Branch,
  BranchParams,
  BranchResponse,
  CreateBranchRequest,
  SingleBranchResponse,
} from "../types/branch";

export const branchService = {
  async getAll(filters?: BranchParams): Promise<BranchResponse> {
    try {
      const response = await apiClient.get<BranchResponse>("/api/branches", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  // get branch by id
  async getById(branchId: number): Promise<Branch | null> {
    try {
      const response = await apiClient.get<SingleBranchResponse>(
        `/api/branches/${branchId}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  // create new branch
  async create(data: CreateBranchRequest): Promise<Branch> {
    try {
      const response = await apiClient.post<SingleBranchResponse>(
        `/api/branches`,
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  // update branch
  async update(branchId: number, data: CreateBranchRequest): Promise<Branch> {
    try {
      const response = await apiClient.patch<SingleBranchResponse>(
        `/api/branches/${branchId}`,
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  // delete branch
  async delete(branchId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/branches/${branchId}`);
    } catch (error) {
      const errorMessage = handleAxiosError(error);

      throw new Error(errorMessage);
    }
  },
};
