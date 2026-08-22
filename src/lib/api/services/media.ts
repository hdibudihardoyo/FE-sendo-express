import { apiClient } from "../axios";
import { handleAxiosError } from "../../utils/error-handler";
import type { ApiResponse } from "../types";

export interface MediaUploadResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  fileUrl: string;
  publicId: string;
  isUsed: boolean;
}

export interface MediaDeleteRequest {
  publicId: string;
}

export const mediaService = {
  async uploadSingle(file: File): Promise<MediaUploadResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<ApiResponse<MediaUploadResponse>>(
        "/api/media/upload-single",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  async uploadMultiple(files: File[]): Promise<MediaUploadResponse[]> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiClient.post<ApiResponse<MediaUploadResponse[]>>(
        "/api/media/upload-multiple",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },

  async removeMedia(publicId: MediaDeleteRequest["publicId"]): Promise<void> {
    try {
      await apiClient.request({
        method: "DELETE",
        url: "/api/media",
        data: { publicId },
      });
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      throw new Error(errorMessage);
    }
  },
};
