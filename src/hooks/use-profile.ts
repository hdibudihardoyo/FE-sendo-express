import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/api";
import type {
  UpdateProfileRequest,
  UpdatePasswordRequest,
} from "@/lib/api";
import toast from "react-hot-toast";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user", "auth"], data);
      toast.success("Profile berhasil diperbarui!");
    },

    onError: (error: Error) => {
      const errorMessage =
        error.message || "Gagal memperbarui profile. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePasswordRequest) =>
      authService.updatePassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "auth"] });
      toast.success("Password berhasil diperbarui!");
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Gagal memperbarui password. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};
