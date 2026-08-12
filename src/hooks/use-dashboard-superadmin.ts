import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { SuperAdminDashboard } from "@/lib/api/services/dashboard-superadmin";
import type {
  DashboardSummaryResponse,
  DailyRevenueChartResponse,
  VolumeBranchResponse,
  ShipmentStatusDistributionResponse,
  BranchPerformanceRankingResponse,
  RecentShipmentsResponse,
  DashboardAlertsResponse,
} from "@/lib/api/types/dashboard-superadmin";

interface RecentShipmentsParams {
  limit: number;
  paymentStatus?: string;
  page: number;
}

interface DashboardAlertsParams {
  limit: number;
  page: number;
}

const PAYMENT_STATUS_OPTIONS = [
  "PENDING",
  "PAID",
  "SETTLED",
  "EXPIRED",
  "FAILED",
  "REFUNDED",
] as const;
type PaymentStatus = (typeof PAYMENT_STATUS_OPTIONS)[number];

const SHIPMENTS_PAGE_MIN = 1;
const SHIPMENTS_LIMIT_MIN = 1;
const SHIPMENTS_LIMIT_MAX = 100;

const BRANCH_LIMIT_MIN = 1;
const BRANCH_LIMIT_MAX = 100;

const REVENUE_DAYS_MIN = 1;
const REVENUE_DAYS_MAX = 365;

const ALERTS_PAGE_MIN = 1;
const ALERTS_LIMIT_MIN = 1;
const ALERTS_LIMIT_MAX = 100;

const REFRESH_INTERVAL = 30 * 1000;

function clampInt(value: number, min: number, max?: number): number {
  const intValue = Number.isFinite(value) ? Math.trunc(value) : min;
  const withMin = Math.max(min, intValue);
  return max !== undefined ? Math.min(max, withMin) : withMin;
}

function normalizeDashboardAlertsParams(
  params: DashboardAlertsParams,
): DashboardAlertsParams {
  return {
    page: clampInt(params.page, ALERTS_PAGE_MIN),
    limit: clampInt(params.limit, ALERTS_LIMIT_MIN, ALERTS_LIMIT_MAX),
  };
}

function normalizePaymentStatus(status?: string): PaymentStatus | undefined {
  if (!status) return undefined;
  const upper = status.toUpperCase();
  return (PAYMENT_STATUS_OPTIONS as readonly string[]).includes(upper)
    ? (upper as PaymentStatus)
    : undefined;
}

function normalizeRecentShipmentsParams(
  params: RecentShipmentsParams,
): RecentShipmentsParams {
  return {
    page: clampInt(params.page, SHIPMENTS_PAGE_MIN),
    limit: clampInt(params.limit, SHIPMENTS_LIMIT_MIN, SHIPMENTS_LIMIT_MAX),
    paymentStatus: normalizePaymentStatus(params.paymentStatus),
  };
}

function normalizeBranchLimit(limit: number): number {
  return clampInt(limit, BRANCH_LIMIT_MIN, BRANCH_LIMIT_MAX);
}

function normalizeRevenueDays(days: number): number {
  return clampInt(days, REVENUE_DAYS_MIN, REVENUE_DAYS_MAX);
}

export const superAdminDashboardKeys = {
  all: ["superadmin-dashboard"] as const,
  summary: () => [...superAdminDashboardKeys.all, "summary"] as const,
  revenue: (days: number) =>
    [
      ...superAdminDashboardKeys.all,
      "revenue",
      normalizeRevenueDays(days),
    ] as const,
  volumeByBranch: (limit: number) =>
    [
      ...superAdminDashboardKeys.all,
      "volume-branch",
      normalizeBranchLimit(limit),
    ] as const,
  statusDistribution: () =>
    [...superAdminDashboardKeys.all, "status-distribution"] as const,
  branchRanking: () =>
    [...superAdminDashboardKeys.all, "branch-ranking"] as const,
  recentShipments: (params: RecentShipmentsParams) =>
    [
      ...superAdminDashboardKeys.all,
      "recent-shipments",
      normalizeRecentShipmentsParams(params),
    ] as const,
  alerts: (params: DashboardAlertsParams) =>
    [
      ...superAdminDashboardKeys.all,
      "alerts",
      normalizeDashboardAlertsParams(params),
    ] as const,
};

export function useDashboardSummary() {
  return useQuery<DashboardSummaryResponse, Error>({
    queryKey: superAdminDashboardKeys.summary(),
    queryFn: () => SuperAdminDashboard.getDashboardSummary(),
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useDailyRevenueChart(days: number) {
  const normalizedDays = normalizeRevenueDays(days);

  return useQuery<DailyRevenueChartResponse, Error>({
    queryKey: superAdminDashboardKeys.revenue(normalizedDays),
    queryFn: () => SuperAdminDashboard.getDailyRevenueChart(normalizedDays),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useVolumeByBranch(limit: number) {
  const normalizedLimit = normalizeBranchLimit(limit);

  return useQuery<VolumeBranchResponse, Error>({
    queryKey: superAdminDashboardKeys.volumeByBranch(normalizedLimit),
    queryFn: () => SuperAdminDashboard.getVolumeByBranch(normalizedLimit),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useShipmentStatusDistribution() {
  return useQuery<ShipmentStatusDistributionResponse, Error>({
    queryKey: superAdminDashboardKeys.statusDistribution(),
    queryFn: () => SuperAdminDashboard.getShipmentStatusDistribution(),
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useBranchPerformanceRanking() {
  return useQuery<BranchPerformanceRankingResponse, Error>({
    queryKey: superAdminDashboardKeys.branchRanking(),
    queryFn: () => SuperAdminDashboard.getBranchPerformanceRanking(),
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useRecentShipments(params: RecentShipmentsParams) {
  const normalizedParams = normalizeRecentShipmentsParams(params);

  return useQuery<RecentShipmentsResponse, Error>({
    queryKey: superAdminDashboardKeys.recentShipments(normalizedParams),
    queryFn: () => SuperAdminDashboard.getRecentShipments(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useDashboardAlerts(params: DashboardAlertsParams) {
  const normalizedParams = normalizeDashboardAlertsParams(params);

  return useQuery<DashboardAlertsResponse, Error>({
    queryKey: superAdminDashboardKeys.alerts(normalizedParams),
    queryFn: () => SuperAdminDashboard.getDashboardAlerts(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}
