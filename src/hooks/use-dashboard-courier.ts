import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { courierDashboard, type paramsCourier } from "@/lib/api/services/dashboard-courier";
import type {
    DashboardSummaryResponse,
    CourierTaskListResponse,
    CourierRouteMapResponse,
    CourierOnGoingPackagesResponse,
} from "@/lib/api/types/dashboard-courier";

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const PAGE_MIN = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 100;

function clampInt(value: number, min: number, max?: number): number {
    const intValue = Number.isFinite(value) ? Math.trunc(value) : min;
    const withMin = Math.max(min, intValue);
    return max !== undefined ? Math.min(max, withMin) : withMin;
}

function todayIso(): string {
    return new Date().toISOString().slice(0, 10); 
}

function normalizeDate(date: string): string {
    return DATE_FORMAT_REGEX.test(date) ? date : todayIso();
}

function normalizeParamsCourier(params: paramsCourier): paramsCourier {
    return {
        date: normalizeDate(params.date),
        page: clampInt(params.page, PAGE_MIN),
        limit: clampInt(params.limit, LIMIT_MIN, LIMIT_MAX),
    };
}

export const courierDashboardKeys = {
    all: ["courier-dashboard"] as const,
    summary: (params: paramsCourier) =>
        [...courierDashboardKeys.all, "summary", normalizeParamsCourier(params)] as const,
    taskList: (params: paramsCourier) =>
        [...courierDashboardKeys.all, "task-list", normalizeParamsCourier(params)] as const,
    routeMap: () => [...courierDashboardKeys.all, "route-map"] as const,
    onGoingPackages: () => [...courierDashboardKeys.all, "on-going-packages"] as const,
};

export function useCourierDashboardSummary(params: paramsCourier) {
    const normalizedParams = normalizeParamsCourier(params);

    return useQuery<DashboardSummaryResponse, Error>({
        queryKey: courierDashboardKeys.summary(normalizedParams),
        queryFn: () => courierDashboard.getDashboardCourierSummary(normalizedParams),
        staleTime: 60 * 1000,
    });
}

export function useCourierTaskList(params: paramsCourier) {
    const normalizedParams = normalizeParamsCourier(params);

    return useQuery<CourierTaskListResponse, Error>({
        queryKey: courierDashboardKeys.taskList(normalizedParams),
        queryFn: () => courierDashboard.getCourierTaskList(normalizedParams),
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
}

export function useCourierRouteMap() {
    return useQuery<CourierRouteMapResponse, Error>({
        queryKey: courierDashboardKeys.routeMap(),
        queryFn: () => courierDashboard.getCourierRouteMap(),
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export function useCourierOnGoingPackages() {
    return useQuery<CourierOnGoingPackagesResponse, Error>({
        queryKey: courierDashboardKeys.onGoingPackages(),
        queryFn: () => courierDashboard.getCourierOnGoingPackages(),
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
    });
}