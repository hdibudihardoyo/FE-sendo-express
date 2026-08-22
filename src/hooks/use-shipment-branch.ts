import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shipmentBranchService } from "@/lib/api";
import type {
  ShipmentBranchParams,
  ScanShipmentRequest,
} from "@/lib/api";
import { toast } from "react-hot-toast";

export const shipmentBranchKeys = {
  all: ["shipment-branches"] as const,
  lists: () => [...shipmentBranchKeys.all, "list"] as const,
  list: (params?: ShipmentBranchParams) =>
    [...shipmentBranchKeys.lists(), params] as const,
  details: () => [...shipmentBranchKeys.all, "detail"] as const,
  detail: (id: number) => [...shipmentBranchKeys.details(), id] as const,
  summary: () => [...shipmentBranchKeys.all, "summary"] as const,
};

export const useGetAllShipmentBranch = (params?: ShipmentBranchParams) => {
  return useQuery({
    queryKey: shipmentBranchKeys.list(params),
    queryFn: () => shipmentBranchService.getAllShipmentBranch(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

export const useGetShipmentBranchSummary = () => {
  return useQuery({
    queryKey: shipmentBranchKeys.summary(),
    queryFn: () => shipmentBranchService.getShipmentBranchSummary(),
  });
};

export const useScanShipmentBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScanShipmentRequest) =>
      shipmentBranchService.scanShipment(data),
    onSuccess: () => {
      toast.success("Paket berhasil discan!");
      queryClient.invalidateQueries({ queryKey: shipmentBranchKeys.lists() });
    },
    onError: () => {
      toast.error("Paket sudah pernah discan. Pemindaian ulang tidak diperbolehkan.");
    }
  });
};
