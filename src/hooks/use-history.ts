import { useQuery } from "@tanstack/react-query";
import { getAllHistory, getHistoryById } from "@/lib/api";
import type { HistoryParams } from "@/lib/api";

// QUERY KEYS
export const historyKeys = {
  all: ["history"] as const,
  lists: () => [...historyKeys.all, "list"] as const,
  list: (params?: HistoryParams) => [...historyKeys.lists(), params] as const,
  details: () => [...historyKeys.all, "detail"] as const,
  detail: (historyId: number) => [...historyKeys.details(), historyId] as const,
};

export const useGetAllHistory = (params?: HistoryParams) => {
  return useQuery({
    queryKey: historyKeys.list(params),
    queryFn: () => getAllHistory(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

export const useHistoryById = (historyId: number) => {
  return useQuery({
    queryKey: historyKeys.detail(historyId),
    queryFn: () => getHistoryById(historyId),
    enabled: !!historyId,
    staleTime: 5 * 60 * 1000,
  });
};
