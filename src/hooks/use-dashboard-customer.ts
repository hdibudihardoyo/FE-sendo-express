import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  customerDashboard,
  type paramsCustomer,
} from "@/lib/api/services/dashboard-customer";
import type {
  ActiveShipmentsResponse,
  shipmentsHistoryResponse,
} from "@/lib/api/types/dashboard-customer";

const PAGE_MIN = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 100;

const REFRESH_INTERVAL = 30 * 1000;

function clampInt(value: number, min: number, max?: number): number {
  const intValue = Number.isFinite(value) ? Math.trunc(value) : min;
  const withMin = Math.max(min, intValue);
  return max !== undefined ? Math.min(max, withMin) : withMin;
}

function normalizeShipmentHistoryParams(
  params: paramsCustomer,
): paramsCustomer {
  return {
    page: clampInt(params.page, PAGE_MIN),
    limit: clampInt(params.limit, LIMIT_MIN, LIMIT_MAX),
  };
}

export const customerDashboardKeys = {
  all: ["customer-dashboard"] as const,
  activeShipments: (params: paramsCustomer) =>
    [
      ...customerDashboardKeys.all,
      "active-shipments",
      normalizeShipmentHistoryParams(params),
    ] as const,
  shipmentHistory: (params: paramsCustomer) =>
    [
      ...customerDashboardKeys.all,
      "shipment-history",
      normalizeShipmentHistoryParams(params),
    ] as const,
};

export function useActiveShipments(params: paramsCustomer) {
  const normalizedParams = normalizeShipmentHistoryParams(params);

  return useQuery<ActiveShipmentsResponse, Error>({
    queryKey: customerDashboardKeys.activeShipments(normalizedParams),
    queryFn: () => customerDashboard.getActiveShipments(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useShipmentHistory(params: paramsCustomer) {
  const normalizedParams = normalizeShipmentHistoryParams(params);

  return useQuery<shipmentsHistoryResponse, Error>({
    queryKey: customerDashboardKeys.shipmentHistory(normalizedParams),
    queryFn: () => customerDashboard.getShipmentHistory(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}
