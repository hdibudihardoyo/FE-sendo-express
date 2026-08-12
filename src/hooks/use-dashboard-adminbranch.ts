import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { AdminBranchDashboard } from "@/lib/api/services/dashboard-adminbranch";
import type {
  AdminBranchDashboardSummaryResponse,
  RecentScanLogsResponse,
  ActivityTrendResponse,
  StuckPackagesAlertResponse,
} from "@/lib/api/types/dashboard-adminbranch";

interface RecentScanLogsParams {
  page?: number;
  limit?: number;
}

interface StuckPackagesAlertParams {
  hours?: number;
  page?: number;
  limit?: number;
}

const ALERT_PAGE_MIN = 1;
const ALERT_LIMIT_MIN = 1;
const ALERT_LIMIT_MAX = 100;

const SCAN_PAGE_MIN = 1;
const SCAN_LIMIT_MIN = 1;
const SCAN_LIMIT_MAX = 100;

const REFRESH_INTERVAL = 30 * 1000;

const DAYS_MIN = 1;
const DAYS_MAX = 30;
const DAYS_DEFAULT = 7;

const HOURS_MIN = 1;
const HOURS_MAX = 72;
const HOURS_DEFAULT = 24;

function clampInt(value: number, min: number, max?: number): number {
  const intValue = Number.isFinite(value) ? Math.trunc(value) : min;
  const withMin = Math.max(min, intValue);
  return max !== undefined ? Math.min(max, withMin) : withMin;
}

function normalizeRecentScanLogsParams(
  params: RecentScanLogsParams,
): RecentScanLogsParams {
  return {
    page:
      params.page !== undefined
        ? clampInt(params.page, SCAN_PAGE_MIN)
        : undefined,
    limit:
      params.limit !== undefined
        ? clampInt(params.limit, SCAN_LIMIT_MIN, SCAN_LIMIT_MAX)
        : undefined,
  };
}

function normalizeStuckPackagesAlertParams(
  params: StuckPackagesAlertParams,
): StuckPackagesAlertParams {
  return {
    hours: normalizeHours(params.hours ?? HOURS_DEFAULT),
    page:
      params.page !== undefined
        ? clampInt(params.page, ALERT_PAGE_MIN)
        : undefined,
    limit:
      params.limit !== undefined
        ? clampInt(params.limit, ALERT_LIMIT_MIN, ALERT_LIMIT_MAX)
        : undefined,
  };
}

function normalizeDays(days: number): number {
  return Number.isFinite(days)
    ? clampInt(days, DAYS_MIN, DAYS_MAX)
    : DAYS_DEFAULT;
}

function normalizeHours(hours: number): number {
  return Number.isFinite(hours)
    ? clampInt(hours, HOURS_MIN, HOURS_MAX)
    : HOURS_DEFAULT;
}

export const adminBranchDashboardKeys = {
  all: ["admin-branch-dashboard"] as const,
  summary: () => [...adminBranchDashboardKeys.all, "summary"] as const,
  recentScanLogs: (params: RecentScanLogsParams) =>
    [
      ...adminBranchDashboardKeys.all,
      "recent-scan-logs",
      normalizeRecentScanLogsParams(params),
    ] as const,
  activityTrend: (days: number) =>
    [
      ...adminBranchDashboardKeys.all,
      "activity-trend",
      normalizeDays(days),
    ] as const,
  stuckPackagesAlert: (params: StuckPackagesAlertParams) =>
    [
      ...adminBranchDashboardKeys.all,
      "stuck-packages-alert",
      normalizeStuckPackagesAlertParams(params),
    ] as const,
};

export function useAdminBranchDashboardSummary() {
  return useQuery<AdminBranchDashboardSummaryResponse, Error>({
    queryKey: adminBranchDashboardKeys.summary(),
    queryFn: () => AdminBranchDashboard.getAdminBranchDashboardSummary(),
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useRecentScanLogs(params: RecentScanLogsParams = {}) {
  const normalizedParams = normalizeRecentScanLogsParams(params);

  return useQuery<RecentScanLogsResponse, Error>({
    queryKey: adminBranchDashboardKeys.recentScanLogs(normalizedParams),
    queryFn: () => AdminBranchDashboard.getRecentScanLogs(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useActivityTrend(days: number) {
  const normalizedDays = normalizeDays(days);

  return useQuery<ActivityTrendResponse, Error>({
    queryKey: adminBranchDashboardKeys.activityTrend(normalizedDays),
    queryFn: () => AdminBranchDashboard.getActivityTrend(normalizedDays),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useStuckPackagesAlert(params: StuckPackagesAlertParams = {}) {
  const normalizedParams = normalizeStuckPackagesAlertParams(params);

  return useQuery<StuckPackagesAlertResponse, Error>({
    queryKey: adminBranchDashboardKeys.stuckPackagesAlert(normalizedParams),
    queryFn: () => AdminBranchDashboard.getStuckPackagesAlert(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchInterval: REFRESH_INTERVAL,
  });
}
