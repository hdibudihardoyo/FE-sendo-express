import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type { Permission, PermissionResponse } from "../types/permission";

export const permissionService = {
  async getPermissions(): Promise<Permission[]> {
    try {
      const response =
        await apiClient.get<PermissionResponse>("/api/permissions");
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },
};
